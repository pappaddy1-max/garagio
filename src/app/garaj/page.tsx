"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  getBrands,
  getEngines,
  getModels,
  getYears,
} from "../data/cars";

import {
  createClient,
} from "../../lib/supabase/client";

type ServiceRecord = {
  id: string;
  date: string;
  mileage: number;
  operations: string[];
  otherWork: string;
  cost: number | null;
  notes: string;
  createdAt: string;
};

type Vehicle = {
  id: string;

  brand: string;
  model: string;
  year: string;
  engine: string;

  vin: string;

  mileage: number;
  yearlyKm: number;

  lastServiceKm: number;
  lastServiceDate: string;

  serviceHistory?: ServiceRecord[];
};

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type LocalVehicle = Vehicle;

const SERVICE_INTERVAL_KM = 15000;

const SERVICE_OPERATIONS = [
  "Ulei motor",
  "Filtru ulei",
  "Filtru aer",
  "Filtru habitaclu",
  "Filtru combustibil",
  "Bujii",
  "Plăcuțe frână",
  "Discuri frână",
  "Lichid frână",
  "Antigel",
  "Distribuție",
];

const emptyForm = {
  brand: "",
  model: "",
  year: "",
  engine: "",

  vin: "",

  mileage: "",
  yearlyKm: "15000",

  lastServiceKm: "",
  lastServiceDate: "",
};

const supabase = createClient();

export default function GaragePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [userId, setUserId] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingVehicleId, setEditingVehicleId] =
    useState<string | null>(null);

  const [quickMileageId, setQuickMileageId] =
    useState<string | null>(null);

  const [quickMileage, setQuickMileage] =
    useState("");

  const [serviceVehicleId, setServiceVehicleId] =
    useState<string | null>(null);

  const [historyVehicleId, setHistoryVehicleId] =
    useState<string | null>(null);

  const [serviceError, setServiceError] =
    useState("");

  const [serviceForm, setServiceForm] =
    useState({
      date: "",
      mileage: "",
      operations: [] as string[],
      otherWork: "",
      cost: "",
      notes: "",
    });

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState(emptyForm);

  const brands = getBrands();

  const models = getModels(
    form.brand
  );

  const years = getYears(
    form.brand,
    form.model
  );

  const engines = getEngines(
    form.brand,
    form.model,
    form.year
  );

  useEffect(() => {
    async function startGarage() {
      setIsLoading(true);
      setError("");

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !userData.user
      ) {
        console.error(
          "Utilizator neautentificat:",
          userError
        );

        setProfile(null);
        setVehicles([]);
        setUserId("");
        setIsLoading(false);
        return;
      }

      const user =
        userData.user;

      setUserId(
        user.id
      );

      const {
        data: profileData,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select(
            "first_name, last_name, phone"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();

      if (profileError) {
        console.error(
          "Eroare profil:",
          profileError
        );
      }

      const loadedProfile: Profile = {
        firstName:
          profileData?.first_name ||
          user.user_metadata?.first_name ||
          "",

        lastName:
          profileData?.last_name ||
          user.user_metadata?.last_name ||
          "",

        email:
          user.email || "",

        phone:
          profileData?.phone ||
          user.user_metadata?.phone ||
          "",
      };

      setProfile(
        loadedProfile
      );

      await migrateLocalGarageIfNeeded(
        user.id
      );

      await loadGarage(
        user.id
      );

      setIsLoading(false);
    }

    startGarage();
  }, []);

  async function loadGarage(
    currentUserId: string
  ) {
    const {
      data: vehicleRows,
      error: vehicleError,
    } =
      await supabase
        .from("vehicles")
        .select(
          "id, brand, model, year, engine, vin, mileage, yearly_km, last_service_km, last_service_date, created_at"
        )
        .eq(
          "user_id",
          currentUserId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (vehicleError) {
      console.error(
        "Eroare încărcare mașini:",
        vehicleError
      );

      setError(
        "Nu am putut încărca mașinile din Garagio."
      );

      return;
    }

    const rows =
      vehicleRows || [];

    if (rows.length === 0) {
      setVehicles([]);
      return;
    }

    const vehicleIds =
      rows.map(
        (vehicle) =>
          vehicle.id
      );

    const {
      data: serviceRows,
      error: serviceRowsError,
    } =
      await supabase
        .from("service_records")
        .select(
          "id, vehicle_id, service_date, mileage, operations, other_work, cost, notes, created_at"
        )
        .eq(
          "user_id",
          currentUserId
        )
        .in(
          "vehicle_id",
          vehicleIds
        )
        .order(
          "service_date",
          {
            ascending: false,
          }
        )
        .order(
          "mileage",
          {
            ascending: false,
          }
        );

    if (serviceRowsError) {
      console.error(
        "Eroare încărcare istoric:",
        serviceRowsError
      );
    }

    const mappedVehicles: Vehicle[] =
      rows.map(
        (vehicle) => {
          const history: ServiceRecord[] =
            (
              serviceRows || []
            )
              .filter(
                (record) =>
                  record.vehicle_id ===
                  vehicle.id
              )
              .map(
                (record) => ({
                  id:
                    record.id,

                  date:
                    record.service_date,

                  mileage:
                    Number(
                      record.mileage
                    ),

                  operations:
                    record.operations ||
                    [],

                  otherWork:
                    record.other_work ||
                    "",

                  cost:
                    record.cost ===
                    null
                      ? null
                      : Number(
                          record.cost
                        ),

                  notes:
                    record.notes ||
                    "",

                  createdAt:
                    record.created_at,
                })
              );

          return {
            id:
              vehicle.id,

            brand:
              vehicle.brand,

            model:
              vehicle.model,

            year:
              vehicle.year,

            engine:
              vehicle.engine,

            vin:
              vehicle.vin ||
              "",

            mileage:
              Number(
                vehicle.mileage
              ),

            yearlyKm:
              Number(
                vehicle.yearly_km
              ),

            lastServiceKm:
              Number(
                vehicle.last_service_km
              ),

            lastServiceDate:
              vehicle.last_service_date ||
              "",

            serviceHistory:
              history,
          };
        }
      );

    setVehicles(
      mappedVehicles
    );
  }

  async function migrateLocalGarageIfNeeded(
    currentUserId: string
  ) {
    const savedVehicles =
      window.localStorage.getItem(
        "garagio-vehicles"
      );

    if (!savedVehicles) {
      return;
    }

    let localVehicles:
      LocalVehicle[] = [];

    try {
      localVehicles =
        JSON.parse(
          savedVehicles
        );
    } catch (parseError) {
      console.error(
        "Nu am putut citi garajul local:",
        parseError
      );

      return;
    }

    if (
      !Array.isArray(
        localVehicles
      ) ||
      localVehicles.length ===
        0
    ) {
      window.localStorage.removeItem(
        "garagio-vehicles"
      );

      return;
    }

    const {
      data: existingRows,
      error: existingError,
    } =
      await supabase
        .from("vehicles")
        .select(
          "id, brand, model, year, engine"
        )
        .eq(
          "user_id",
          currentUserId
        );

    if (existingError) {
      console.error(
        "Eroare verificare migrare:",
        existingError
      );

      return;
    }

    function vehicleKey(
      vehicle: {
        brand: string;
        model: string;
        year: string;
        engine: string;
      }
    ) {
      return [
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.engine,
      ]
        .join("||")
        .toLowerCase();
    }

    const existingKeys =
      new Set(
        (existingRows || []).map(
          vehicleKey
        )
      );

    let migrationFailed =
      false;

    for (
      const localVehicle
      of localVehicles
    ) {
      const key =
        vehicleKey(
          localVehicle
        );

      if (
        existingKeys.has(
          key
        )
      ) {
        continue;
      }

      const {
        data: insertedVehicle,
        error: insertVehicleError,
      } =
        await supabase
          .from("vehicles")
          .insert({
            user_id:
              currentUserId,

            brand:
              localVehicle.brand,

            model:
              localVehicle.model,

            year:
              localVehicle.year,

            engine:
              localVehicle.engine,

            vin:
              localVehicle.vin ||
              null,

            mileage:
              Number(
                localVehicle.mileage ||
                0
              ),

            yearly_km:
              Number(
                localVehicle.yearlyKm ||
                15000
              ),

            last_service_km:
              Number(
                localVehicle.lastServiceKm ||
                0
              ),

            last_service_date:
              localVehicle.lastServiceDate ||
              null,
          })
          .select(
            "id"
          )
          .single();

      if (
        insertVehicleError ||
        !insertedVehicle
      ) {
        console.error(
          "Eroare migrare mașină:",
          insertVehicleError
        );

        migrationFailed =
          true;

        continue;
      }

      existingKeys.add(
        key
      );

      const history =
        localVehicle.serviceHistory ||
        [];

      if (
        history.length >
        0
      ) {
        const servicePayload =
          history.map(
            (record) => ({
              vehicle_id:
                insertedVehicle.id,

              user_id:
                currentUserId,

              service_date:
                record.date,

              mileage:
                Number(
                  record.mileage
                ),

              operations:
                record.operations ||
                [],

              other_work:
                record.otherWork ||
                null,

              cost:
                record.cost,

              notes:
                record.notes ||
                null,

              created_at:
                record.createdAt ||
                new Date().toISOString(),
            })
          );

        const {
          error: serviceInsertError,
        } =
          await supabase
            .from(
              "service_records"
            )
            .insert(
              servicePayload
            );

        if (
          serviceInsertError
        ) {
          console.error(
            "Eroare migrare istoric:",
            serviceInsertError
          );

          migrationFailed =
            true;
        }
      }
    }

    if (!migrationFailed) {
      window.localStorage.removeItem(
        "garagio-vehicles"
      );

      window.localStorage.setItem(
        "garagio-local-migration-complete",
        new Date().toISOString()
      );
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingVehicleId(null);
    setShowForm(false);
    setError("");
  }

  function openAddForm() {
    if (!userId) {
      window.location.href =
        "/cont";

      return;
    }

    setForm(emptyForm);
    setEditingVehicleId(null);
    setError("");
    setShowForm(true);

    window.setTimeout(() => {
      document
        .getElementById(
          "vehicle-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function openEditForm(
    vehicle: Vehicle
  ) {
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      engine: vehicle.engine,

      vin:
        vehicle.vin ||
        "",

      mileage:
        vehicle.mileage > 0
          ? String(
              vehicle.mileage
            )
          : "",

      yearlyKm:
        vehicle.yearlyKm > 0
          ? String(
              vehicle.yearlyKm
            )
          : "15000",

      lastServiceKm:
        vehicle.lastServiceKm > 0
          ? String(
              vehicle.lastServiceKm
            )
          : "",

      lastServiceDate:
        vehicle.lastServiceDate ||
        "",
    });

    setEditingVehicleId(
      vehicle.id
    );

    setError("");
    setShowForm(true);

    window.setTimeout(() => {
      document
        .getElementById(
          "vehicle-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

    setError("");
  }

  function changeBrand(
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,

        brand: value,
        model: "",
        year: "",
        engine: "",
      })
    );

    setError("");
  }

  function changeModel(
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,

        model: value,
        year: "",
        engine: "",
      })
    );

    setError("");
  }

  function changeYear(
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,

        year: value,
        engine: "",
      })
    );

    setError("");
  }

  async function saveVehicle(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!userId) {
      setError(
        "Trebuie să fii autentificat pentru a salva mașina."
      );

      return;
    }

    if (
      !form.brand ||
      !form.model ||
      !form.year ||
      !form.engine
    ) {
      setError(
        "Selectează marca, modelul, anul și motorizarea."
      );

      return;
    }

    if (!form.mileage) {
      setError(
        "Completează kilometrajul actual."
      );

      return;
    }

    if (
      form.vin.trim() &&
      form.vin.trim().length !==
        17
    ) {
      setError(
        "VIN-ul trebuie să aibă exact 17 caractere."
      );

      return;
    }

    const mileage =
      Number(
        form.mileage
      );

    const yearlyKm =
      Number(
        form.yearlyKm ||
        15000
      );

    if (
      Number.isNaN(
        mileage
      ) ||
      mileage < 0
    ) {
      setError(
        "Kilometrajul introdus nu este valid."
      );

      return;
    }

    const lastServiceKm =
      form.lastServiceKm
        ? Number(
            form.lastServiceKm
          )
        : 0;

    if (
      lastServiceKm >
      mileage
    ) {
      setError(
        "Kilometrajul ultimei revizii nu poate fi mai mare decât kilometrajul actual."
      );

      return;
    }

    const payload = {
      brand:
        form.brand,

      model:
        form.model,

      year:
        form.year,

      engine:
        form.engine,

      vin:
        form.vin
          .trim()
          .toUpperCase() ||
        null,

      mileage,

      yearly_km:
        yearlyKm,

      last_service_km:
        lastServiceKm,

      last_service_date:
        form.lastServiceDate ||
        null,

      updated_at:
        new Date().toISOString(),
    };

    if (
      editingVehicleId
    ) {
      const {
        error:
          updateError,
      } =
        await supabase
          .from(
            "vehicles"
          )
          .update(
            payload
          )
          .eq(
            "id",
            editingVehicleId
          )
          .eq(
            "user_id",
            userId
          );

      if (
        updateError
      ) {
        setError(
          updateError.message
        );

        return;
      }
    } else {
      const {
        error:
          insertError,
      } =
        await supabase
          .from(
            "vehicles"
          )
          .insert({
            ...payload,
            user_id:
              userId,
          });

      if (
        insertError
      ) {
        setError(
          insertError.message
        );

        return;
      }
    }

    await loadGarage(
      userId
    );

    resetForm();
  }

  function startQuickMileage(
    vehicle: Vehicle
  ) {
    setQuickMileageId(
      vehicle.id
    );

    setQuickMileage(
      vehicle.mileage > 0
        ? String(
            vehicle.mileage
          )
        : ""
    );
  }

  function cancelQuickMileage() {
    setQuickMileageId(null);
    setQuickMileage("");
  }

  async function saveQuickMileage(
    vehicle: Vehicle
  ) {
    if (!userId) {
      return;
    }

    const newMileage =
      Number(
        quickMileage
      );

    if (
      !quickMileage ||
      Number.isNaN(
        newMileage
      ) ||
      newMileage < 0
    ) {
      window.alert(
        "Introdu un kilometraj valid."
      );

      return;
    }

    if (
      newMileage <
      vehicle.mileage
    ) {
      const confirmed =
        window.confirm(
          `Kilometrajul introdus (${newMileage.toLocaleString(
            "ro-RO"
          )} km) este mai mic decât cel salvat (${vehicle.mileage.toLocaleString(
            "ro-RO"
          )} km). Sigur vrei să continui?`
        );

      if (!confirmed) {
        return;
      }
    }

    const {
      error:
        mileageError,
    } =
      await supabase
        .from("vehicles")
        .update({
          mileage:
            newMileage,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          vehicle.id
        )
        .eq(
          "user_id",
          userId
        );

    if (
      mileageError
    ) {
      window.alert(
        mileageError.message
      );

      return;
    }

    await loadGarage(
      userId
    );

    cancelQuickMileage();
  }

  function getTodayDate() {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  }

  function openServiceForm(
    vehicle: Vehicle
  ) {
    setServiceVehicleId(
      vehicle.id
    );

    setServiceError("");

    setServiceForm({
      date:
        getTodayDate(),

      mileage:
        vehicle.mileage > 0
          ? String(
              vehicle.mileage
            )
          : "",

      operations: [
        "Ulei motor",
        "Filtru ulei",
      ],

      otherWork: "",
      cost: "",
      notes: "",
    });
  }

  function closeServiceForm() {
    setServiceVehicleId(
      null
    );

    setServiceError("");

    setServiceForm({
      date: "",
      mileage: "",
      operations: [],
      otherWork: "",
      cost: "",
      notes: "",
    });
  }

  function toggleServiceOperation(
    operation: string
  ) {
    setServiceForm(
      (current) => {
        const exists =
          current.operations.includes(
            operation
          );

        return {
          ...current,

          operations:
            exists
              ? current.operations.filter(
                  (item) =>
                    item !==
                    operation
                )
              : [
                  ...current.operations,
                  operation,
                ],
        };
      }
    );

    setServiceError("");
  }

  async function recalculateLatestService(
    vehicleId: string
  ) {
    if (!userId) {
      return;
    }

    const {
      data:
        latestRecords,
      error:
        latestError,
    } =
      await supabase
        .from(
          "service_records"
        )
        .select(
          "service_date, mileage"
        )
        .eq(
          "vehicle_id",
          vehicleId
        )
        .eq(
          "user_id",
          userId
        )
        .order(
          "service_date",
          {
            ascending: false,
          }
        )
        .order(
          "mileage",
          {
            ascending: false,
          }
        )
        .limit(1);

    if (
      latestError
    ) {
      console.error(
        "Eroare recalculare revizie:",
        latestError
      );

      return;
    }

    const latest =
      latestRecords?.[0];

    await supabase
      .from("vehicles")
      .update({
        last_service_km:
          latest
            ? Number(
                latest.mileage
              )
            : 0,

        last_service_date:
          latest
            ? latest.service_date
            : null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        vehicleId
      )
      .eq(
        "user_id",
        userId
      );
  }

  async function saveServiceRecord(
    vehicle: Vehicle
  ) {
    if (!userId) {
      setServiceError(
        "Trebuie să fii autentificat."
      );

      return;
    }

    if (
      !serviceForm.date
    ) {
      setServiceError(
        "Selectează data reviziei."
      );

      return;
    }

    if (
      !serviceForm.mileage
    ) {
      setServiceError(
        "Completează kilometrajul la care ai făcut revizia."
      );

      return;
    }

    const serviceMileage =
      Number(
        serviceForm.mileage
      );

    if (
      Number.isNaN(
        serviceMileage
      ) ||
      serviceMileage < 0
    ) {
      setServiceError(
        "Kilometrajul introdus nu este valid."
      );

      return;
    }

    if (
      serviceForm.operations.length ===
        0 &&
      !serviceForm.otherWork.trim()
    ) {
      setServiceError(
        "Selectează cel puțin o operațiune sau completează câmpul Alte lucrări."
      );

      return;
    }

    const parsedCost =
      serviceForm.cost.trim()
        ? Number(
            serviceForm.cost
          )
        : null;

    if (
      parsedCost !==
        null &&
      (
        Number.isNaN(
          parsedCost
        ) ||
        parsedCost < 0
      )
    ) {
      setServiceError(
        "Costul introdus nu este valid."
      );

      return;
    }

    const {
      error:
        serviceInsertError,
    } =
      await supabase
        .from(
          "service_records"
        )
        .insert({
          vehicle_id:
            vehicle.id,

          user_id:
            userId,

          service_date:
            serviceForm.date,

          mileage:
            serviceMileage,

          operations:
            serviceForm.operations,

          other_work:
            serviceForm.otherWork
              .trim() ||
            null,

          cost:
            parsedCost,

          notes:
            serviceForm.notes
              .trim() ||
            null,
        });

    if (
      serviceInsertError
    ) {
      setServiceError(
        serviceInsertError.message
      );

      return;
    }

    if (
      serviceMileage >
      vehicle.mileage
    ) {
      await supabase
        .from(
          "vehicles"
        )
        .update({
          mileage:
            serviceMileage,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          vehicle.id
        )
        .eq(
          "user_id",
          userId
        );
    }

    await recalculateLatestService(
      vehicle.id
    );

    await loadGarage(
      userId
    );

    closeServiceForm();

    setHistoryVehicleId(
      vehicle.id
    );
  }

  async function deleteServiceRecord(
    vehicle: Vehicle,
    recordId: string
  ) {
    if (!userId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Sigur vrei să ștergi această înregistrare din istoricul de întreținere?"
      );

    if (!confirmed) {
      return;
    }

    const {
      error:
        deleteRecordError,
    } =
      await supabase
        .from(
          "service_records"
        )
        .delete()
        .eq(
          "id",
          recordId
        )
        .eq(
          "vehicle_id",
          vehicle.id
        )
        .eq(
          "user_id",
          userId
        );

    if (
      deleteRecordError
    ) {
      window.alert(
        deleteRecordError.message
      );

      return;
    }

    await recalculateLatestService(
      vehicle.id
    );

    await loadGarage(
      userId
    );
  }

  async function removeVehicle(
    id: string
  ) {
    if (!userId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Sigur vrei să elimini această mașină din Garaj?"
      );

    if (!confirmed) {
      return;
    }

    const {
      error:
        deleteVehicleError,
    } =
      await supabase
        .from(
          "vehicles"
        )
        .delete()
        .eq(
          "id",
          id
        )
        .eq(
          "user_id",
          userId
        );

    if (
      deleteVehicleError
    ) {
      window.alert(
        deleteVehicleError.message
      );

      return;
    }

    if (
      editingVehicleId ===
      id
    ) {
      resetForm();
    }

    if (
      quickMileageId ===
      id
    ) {
      cancelQuickMileage();
    }

    if (
      serviceVehicleId ===
      id
    ) {
      closeServiceForm();
    }

    await loadGarage(
      userId
    );
  }

  if (isLoading) {
    return (
      <main className="garage-page">
        <header className="topbar">
          <Link
            className="brand"
            href="/"
          >
            <Image
              src="/logo-garagio-v2.png"
              alt="Garagio"
              width={500}
              height={150}
              className="brand-logo"
              priority
            />
          </Link>
        </header>

        <section className="garage-dashboard-content">
          <div className="garage-dashboard-container">
            <div className="garage-empty-state">
              <div className="empty-cart-icon">
                G
              </div>

              <h2>
                Se încarcă Garajul...
              </h2>

              <p>
                Sincronizăm mașinile și istoricul
                tău cu Garagio.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const totalVehicles =
    vehicles.length;

  const profileName =
    profile
      ? `${profile.firstName} ${profile.lastName}`
      : "Vizitator";

  return (
    <main className="garage-page">
      <header className="topbar">
        <Link
          className="brand"
          href="/"
        >
          <Image
            src="/logo-garagio-v2.png"
            alt="Garagio"
            width={500}
            height={150}
            className="brand-logo"
            priority
          />
        </Link>

        <nav>
          <Link href="/">
            Acasă
          </Link>

          <Link href="/piese">
            Piese auto
          </Link>

          <Link href="/cos">
            Coș
          </Link>

          <Link href="/cont">
            Cont
          </Link>
        </nav>
      </header>

      <section className="garage-dashboard-header">
        <div className="garage-dashboard-container">
          <div>
            <span className="eyebrow orange">
              GARAJUL MEU
            </span>

            <h1>
              Bun venit,{" "}
              {profileName}.
            </h1>

            <p>
              Administrează
              mașinile și
              întreținerea lor
              într-un singur loc.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={
              openAddForm
            }
          >
            + Adaugă mașină
          </button>
        </div>
      </section>

      <section className="garage-dashboard-content">
        <div className="garage-dashboard-container">
          {!profile && (
            <div className="garage-profile-warning">
              <div>
                <strong>
                  Nu ai profil
                  Garagio încă.
                </strong>

                <span>
                  Poți testa
                  Garajul Meu,
                  dar în varianta
                  finală mașinile
                  vor fi legate
                  de contul tău.
                </span>
              </div>

              <Link href="/cont">
                Creează profil →
              </Link>
            </div>
          )}

          <div className="garage-dashboard-summary">
            <div>
              <span>
                MAȘINI SALVATE
              </span>

              <strong>
                {totalVehicles}
              </strong>
            </div>

            <div>
              <span>
                REVIZII URMĂRITE
              </span>

              <strong>
                {totalVehicles}
              </strong>
            </div>

            <div>
              <span>
                STATUS CONT
              </span>

              <strong>
                {profile
                  ? "ACTIV"
                  : "DEMO"}
              </strong>
            </div>
          </div>

          {showForm && (
            <form
              id="vehicle-form"
              className="add-vehicle-card"
              onSubmit={
                saveVehicle
              }
            >
              <div className="add-vehicle-header">
                <div>
                  <span className="eyebrow orange">
                    {editingVehicleId
                      ? "EDITARE MAȘINĂ"
                      : "MAȘINĂ NOUĂ"}
                  </span>

                  <h2>
                    {editingVehicleId
                      ? "Editează mașina"
                      : "Adaugă mașina în Garagio"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="close-form-button"
                  onClick={
                    resetForm
                  }
                >
                  ×
                </button>
              </div>

              <div className="garage-vehicle-selector">
                <label>
                  Marcă *

                  <select
                    value={
                      form.brand
                    }
                    onChange={(e) =>
                      changeBrand(
                        e.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Selectează
                      marca
                    </option>

                    {brands.map(
                      (brand) => (
                        <option
                          key={
                            brand
                          }
                          value={
                            brand
                          }
                        >
                          {brand}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Model *

                  <select
                    value={
                      form.model
                    }
                    onChange={(e) =>
                      changeModel(
                        e.target
                          .value
                      )
                    }
                    disabled={
                      !form.brand
                    }
                  >
                    <option value="">
                      {form.brand
                        ? "Selectează modelul"
                        : "Alege marca"}
                    </option>

                    {models.map(
                      (model) => (
                        <option
                          key={
                            model
                          }
                          value={
                            model
                          }
                        >
                          {model}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  An *

                  <select
                    value={
                      form.year
                    }
                    onChange={(e) =>
                      changeYear(
                        e.target
                          .value
                      )
                    }
                    disabled={
                      !form.model
                    }
                  >
                    <option value="">
                      {form.model
                        ? "Selectează anul"
                        : "Alege modelul"}
                    </option>

                    {years.map(
                      (year) => (
                        <option
                          key={
                            year
                          }
                          value={
                            year
                          }
                        >
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Motorizare *

                  <select
                    value={
                      form.engine
                    }
                    onChange={(e) =>
                      updateField(
                        "engine",
                        e.target
                          .value
                      )
                    }
                    disabled={
                      !form.year
                    }
                  >
                    <option value="">
                      {form.year
                        ? "Selectează motorizarea"
                        : "Alege anul"}
                    </option>

                    {engines.map(
                      (engine) => (
                        <option
                          key={
                            engine
                          }
                          value={
                            engine
                          }
                        >
                          {engine}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <div className="checkout-fields two-columns garage-extra-fields">
                <label className="full-field">
                  VIN

                  <input
                    maxLength={
                      17
                    }
                    value={
                      form.vin
                    }
                    onChange={(e) =>
                      updateField(
                        "vin",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="WBA12345678901234"
                  />
                </label>

                <label>
                  Kilometraj
                  actual *

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mileage
                    }
                    onChange={(e) =>
                      updateField(
                        "mileage",
                        e.target
                          .value
                      )
                    }
                    placeholder="152430"
                  />
                </label>

                <label>
                  Km/an
                  aproximativ

                  <input
                    type="number"
                    min="0"
                    value={
                      form.yearlyKm
                    }
                    onChange={(e) =>
                      updateField(
                        "yearlyKm",
                        e.target
                          .value
                      )
                    }
                    placeholder="15000"
                  />
                </label>

                <label>
                  Km la ultima
                  revizie

                  <input
                    type="number"
                    min="0"
                    value={
                      form.lastServiceKm
                    }
                    onChange={(e) =>
                      updateField(
                        "lastServiceKm",
                        e.target
                          .value
                      )
                    }
                    placeholder="142210"
                  />
                </label>

                <label>
                  Data ultimei
                  revizii

                  <input
                    type="date"
                    value={
                      form.lastServiceDate
                    }
                    onChange={(e) =>
                      updateField(
                        "lastServiceDate",
                        e.target
                          .value
                      )
                    }
                  />
                </label>
              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <div className="vehicle-form-actions">
                <button
                  className="primary-btn"
                  type="submit"
                >
                  {editingVehicleId
                    ? "Salvează modificările"
                    : "Salvează mașina"}
                </button>

                <button
                  type="button"
                  className="vehicle-cancel-button"
                  onClick={
                    resetForm
                  }
                >
                  Renunță
                </button>
              </div>
            </form>
          )}

          {vehicles.length ===
          0 ? (
            <div className="garage-empty-state">
              <div className="empty-cart-icon">
                G
              </div>

              <h2>
                Garajul tău este
                gol.
              </h2>

              <p>
                Adaugă prima
                mașină pentru a
                urmări reviziile
                și produsele
                compatibile.
              </p>

              <button
                className="primary-btn"
                onClick={
                  openAddForm
                }
              >
                + Adaugă prima
                mașină
              </button>
            </div>
          ) : (
            <div className="saved-vehicles-grid">
              {vehicles.map(
                (vehicle) => {
                  /*
                   * Mașinile salvate rapid
                   * din catalog au 0 km.
                   */
                  const hasMileage =
                    vehicle.mileage >
                    0;

                  const hasServiceData =
                    hasMileage &&
                    vehicle.lastServiceKm >
                      0;

                  const nextServiceKm =
                    hasServiceData
                      ? vehicle.lastServiceKm +
                        SERVICE_INTERVAL_KM
                      : 0;

                  const kmRemaining =
                    hasServiceData
                      ? nextServiceKm -
                        vehicle.mileage
                      : 0;

                  const progress =
                    hasServiceData
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            ((vehicle.mileage -
                              vehicle.lastServiceKm) /
                              SERVICE_INTERVAL_KM) *
                              100
                          )
                        )
                      : 0;

                  const serviceStatus =
                    !hasMileage
                      ? "Completează datele"
                      : !hasServiceData
                      ? "Revizie necunoscută"
                      : kmRemaining <=
                        0
                      ? "Revizie necesară"
                      : kmRemaining <=
                        2500
                      ? "Revizia se apropie"
                      : "În regulă";

                  const warningStatus =
                    !hasMileage ||
                    !hasServiceData ||
                    kmRemaining <=
                      2500;

                  return (
                    <article
                      className="saved-vehicle-card"
                      key={
                        vehicle.id
                      }
                    >
                      <div className="saved-vehicle-top">
                        <div>
                          <span className="selected-label">
                            MAȘINĂ
                            SALVATĂ
                          </span>

                          <h2>
                            {
                              vehicle.brand
                            }{" "}
                            {
                              vehicle.model
                            }
                          </h2>

                          <p>
                            {
                              vehicle.year
                            }{" "}
                            ·{" "}
                            {
                              vehicle.engine
                            }
                          </p>
                        </div>

                        <span
                          className={
                            warningStatus
                              ? "vehicle-status warning"
                              : "vehicle-status"
                          }
                        >
                          {
                            serviceStatus
                          }
                        </span>
                      </div>

                      <div className="vehicle-data-grid">
                        <div>
                          <span>
                            Kilometraj
                          </span>

                          <strong>
                            {hasMileage
                              ? `${vehicle.mileage.toLocaleString(
                                  "ro-RO"
                                )} km`
                              : "Necompletat"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Ultima
                            revizie
                          </span>

                          <strong>
                            {hasServiceData
                              ? `${vehicle.lastServiceKm.toLocaleString(
                                  "ro-RO"
                                )} km`
                              : "Necompletată"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Următoarea
                          </span>

                          <strong>
                            {hasServiceData
                              ? `${nextServiceKm.toLocaleString(
                                  "ro-RO"
                                )} km`
                              : "—"}
                          </strong>
                        </div>
                      </div>

                      {quickMileageId ===
                      vehicle.id ? (
                        <div className="quick-mileage-box">
                          <div>
                            <span>
                              ACTUALIZEAZĂ
                              KILOMETRAJUL
                            </span>

                            <strong>
                              Kilometraj
                              actual
                            </strong>
                          </div>

                          <div className="quick-mileage-controls">
                            <input
                              type="number"
                              min="0"
                              autoFocus
                              value={
                                quickMileage
                              }
                              onChange={(e) =>
                                setQuickMileage(
                                  e.target
                                    .value
                                )
                              }
                              placeholder="Ex. 154100"
                              onKeyDown={(e) => {
                                if (
                                  e.key ===
                                  "Enter"
                                ) {
                                  saveQuickMileage(
                                    vehicle
                                  );
                                }

                                if (
                                  e.key ===
                                  "Escape"
                                ) {
                                  cancelQuickMileage();
                                }
                              }}
                            />

                            <button
                              type="button"
                              className="quick-mileage-save"
                              onClick={() =>
                                saveQuickMileage(
                                  vehicle
                                )
                              }
                            >
                              Salvează
                            </button>

                            <button
                              type="button"
                              className="quick-mileage-cancel"
                              onClick={
                                cancelQuickMileage
                              }
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="quick-mileage-trigger"
                          onClick={() =>
                            startQuickMileage(
                              vehicle
                            )
                          }
                        >
                          + Actualizează km
                        </button>
                      )}

                      {hasServiceData ? (
                        <div className="service-progress-wrapper">
                          <div className="service-progress-text">
                            <span>
                              Interval
                              revizie
                            </span>

                            <strong>
                              {kmRemaining >
                              0
                                ? `${kmRemaining.toLocaleString(
                                    "ro-RO"
                                  )} km rămași`
                                : `${Math.abs(
                                    kmRemaining
                                  ).toLocaleString(
                                    "ro-RO"
                                  )} km depășiți`}
                            </strong>
                          </div>

                          <div className="service-progress-bar">
                            <div
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="garage-missing-data">
                          <strong>
                            Completează
                            informațiile
                            mașinii
                          </strong>

                          <span>
                            Adaugă
                            kilometrajul și
                            ultima revizie
                            pentru a putea
                            urmări
                            mentenanța.
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                vehicle
                              )
                            }
                          >
                            Completează
                            datele →
                          </button>
                        </div>
                      )}

                      {vehicle.vin && (
                        <div className="saved-vin">
                          VIN:{" "}
                          {
                            vehicle.vin
                          }
                        </div>
                      )}

                      <div className="vehicle-card-actions">
                        <Link
                          href={`/piese?brand=${encodeURIComponent(
                            vehicle.brand
                          )}&model=${encodeURIComponent(
                            vehicle.model
                          )}&year=${encodeURIComponent(
                            vehicle.year
                          )}&engine=${encodeURIComponent(
                            vehicle.engine
                          )}`}
                          className="vehicle-main-action"
                        >
                          Caută piese →
                        </Link>

                        <button
                          type="button"
                          className="vehicle-service-button"
                          onClick={() =>
                            openServiceForm(
                              vehicle
                            )
                          }
                        >
                          + Am făcut revizia
                        </button>

                        <button
                          type="button"
                          className="vehicle-edit-button"
                          onClick={() =>
                            openEditForm(
                              vehicle
                            )
                          }
                        >
                          Editează
                        </button>

                        <button
                          type="button"
                          className="vehicle-remove-button"
                          onClick={() =>
                            removeVehicle(
                              vehicle.id
                            )
                          }
                        >
                          Elimină
                        </button>
                      </div>

                      {serviceVehicleId ===
                        vehicle.id && (
                        <div className="service-entry-form">
                          <div className="service-entry-header">
                            <div>
                              <span className="selected-label">
                                REVIZIE NOUĂ
                              </span>

                              <h3>
                                Ce ai făcut la mașină?
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={closeServiceForm}
                            >
                              ×
                            </button>
                          </div>

                          <div className="service-entry-fields">
                            <label>
                              Data reviziei *
                              <input
                                type="date"
                                value={serviceForm.date}
                                onChange={(e) =>
                                  setServiceForm(
                                    (current) => ({
                                      ...current,
                                      date: e.target.value,
                                    })
                                  )
                                }
                              />
                            </label>

                            <label>
                              Kilometraj *
                              <input
                                type="number"
                                min="0"
                                value={serviceForm.mileage}
                                onChange={(e) =>
                                  setServiceForm(
                                    (current) => ({
                                      ...current,
                                      mileage: e.target.value,
                                    })
                                  )
                                }
                                placeholder="154100"
                              />
                            </label>

                            <label>
                              Cost total
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={serviceForm.cost}
                                onChange={(e) =>
                                  setServiceForm(
                                    (current) => ({
                                      ...current,
                                      cost: e.target.value,
                                    })
                                  )
                                }
                                placeholder="Ex. 650"
                              />
                            </label>
                          </div>

                          <div className="service-operations">
                            <strong>
                              Operațiuni efectuate
                            </strong>

                            <div className="service-operation-grid">
                              {SERVICE_OPERATIONS.map(
                                (operation) => {
                                  const checked =
                                    serviceForm.operations.includes(
                                      operation
                                    );

                                  return (
                                    <label
                                      key={operation}
                                      className={
                                        checked
                                          ? "service-operation active"
                                          : "service-operation"
                                      }
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                          toggleServiceOperation(
                                            operation
                                          )
                                        }
                                      />
                                      <span>{operation}</span>
                                    </label>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div className="service-text-fields">
                            <label>
                              Alte lucrări
                              <input
                                type="text"
                                value={serviceForm.otherWork}
                                onChange={(e) =>
                                  setServiceForm(
                                    (current) => ({
                                      ...current,
                                      otherWork: e.target.value,
                                    })
                                  )
                                }
                                placeholder="Ex. schimb brațe față, geometrie..."
                              />
                            </label>

                            <label>
                              Observații
                              <textarea
                                value={serviceForm.notes}
                                onChange={(e) =>
                                  setServiceForm(
                                    (current) => ({
                                      ...current,
                                      notes: e.target.value,
                                    })
                                  )
                                }
                                placeholder="Orice vrei să reții despre această intervenție..."
                                rows={3}
                              />
                            </label>
                          </div>

                          {serviceError && (
                            <div className="checkout-error">
                              {serviceError}
                            </div>
                          )}

                          <div className="service-form-actions">
                            <button
                              type="button"
                              className="primary-btn"
                              onClick={() =>
                                saveServiceRecord(vehicle)
                              }
                            >
                              Salvează revizia
                            </button>

                            <button
                              type="button"
                              className="vehicle-cancel-button"
                              onClick={closeServiceForm}
                            >
                              Renunță
                            </button>
                          </div>
                        </div>
                      )}

                      {(vehicle.serviceHistory?.length || 0) >
                        0 && (
                        <div className="service-history">
                          <button
                            type="button"
                            className="service-history-toggle"
                            onClick={() =>
                              setHistoryVehicleId(
                                historyVehicleId === vehicle.id
                                  ? null
                                  : vehicle.id
                              )
                            }
                          >
                            <span>
                              Istoric întreținere
                            </span>

                            <strong>
                              {vehicle.serviceHistory!.length}{" "}
                              {vehicle.serviceHistory!.length === 1
                                ? "înregistrare"
                                : "înregistrări"}{" "}
                              {historyVehicleId === vehicle.id
                                ? "▲"
                                : "▼"}
                            </strong>
                          </button>

                          {historyVehicleId ===
                            vehicle.id && (
                            <div className="service-history-list">
                              {vehicle.serviceHistory!.map(
                                (record) => (
                                  <div
                                    className="service-history-item"
                                    key={record.id}
                                  >
                                    <div className="service-history-date">
                                      <strong>
                                        {new Date(
                                          `${record.date}T12:00:00`
                                        ).toLocaleDateString(
                                          "ro-RO",
                                          {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          }
                                        )}
                                      </strong>

                                      <span>
                                        {record.mileage.toLocaleString(
                                          "ro-RO"
                                        )}{" "}
                                        km
                                      </span>
                                    </div>

                                    <div className="service-history-operations">
                                      {record.operations.map(
                                        (operation) => (
                                          <span key={operation}>
                                            ✓ {operation}
                                          </span>
                                        )
                                      )}

                                      {record.otherWork && (
                                        <span>
                                          ✓ {record.otherWork}
                                        </span>
                                      )}
                                    </div>

                                    {(record.cost !== null ||
                                      record.notes) && (
                                      <div className="service-history-details">
                                        {record.cost !== null && (
                                          <strong>
                                            {record.cost.toLocaleString(
                                              "ro-RO",
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )}{" "}
                                            lei
                                          </strong>
                                        )}

                                        {record.notes && (
                                          <p>{record.notes}</p>
                                        )}
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      className="delete-service-record"
                                      onClick={() =>
                                        deleteServiceRecord(
                                          vehicle,
                                          record.id
                                        )
                                      }
                                    >
                                      Șterge
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}