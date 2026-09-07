"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  getBrands,
  getEngines,
  getModels,
  getYears,
} from "../data/cars";

export default function VehicleSelector() {
  const router = useRouter();

  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [year, setYear] =
    useState("");

  const [engine, setEngine] =
    useState("");

  const [vin, setVin] =
    useState("");

  const [result, setResult] =
    useState("");

  const [vinError, setVinError] =
    useState(false);

  const brands = getBrands();
  const models = getModels(brand);
  const years = getYears(
    brand,
    model
  );
  const engines = getEngines(
    brand,
    model,
    year
  );

  const selectionComplete =
    Boolean(
      brand &&
      model &&
      year &&
      engine
    );

  function changeBrand(
    value: string
  ) {
    setBrand(value);
    setModel("");
    setYear("");
    setEngine("");
    setResult("");
    setVinError(false);
  }

  function changeModel(
    value: string
  ) {
    setModel(value);
    setYear("");
    setEngine("");
    setResult("");
    setVinError(false);
  }

  function changeYear(
    value: string
  ) {
    setYear(value);
    setEngine("");
    setResult("");
    setVinError(false);
  }

  function searchParts() {
    if (!selectionComplete) {
      return;
    }

    const params =
      new URLSearchParams({
        brand,
        model,
        year,
        engine,
      });

    router.push(
      `/piese?${params.toString()}`
    );
  }

  function identifyVin() {
    const cleanedVin = vin
      .trim()
      .replace(/\s/g, "")
      .toUpperCase();

    if (cleanedVin.length !== 17) {
      setVinError(true);

      setResult(
        "Seria VIN trebuie să conțină exact 17 caractere."
      );

      return;
    }

    setVinError(false);

    setResult(
      `VIN ${cleanedVin} este valid ca format. Identificarea automată va fi conectată ulterior.`
    );
  }

  return (
    <>
      <div className="car-search">
        <div className="search-grid">
          <select
            value={brand}
            onChange={(e) =>
              changeBrand(
                e.target.value
              )
            }
          >
            <option value="">
              Marcă
            </option>

            {brands.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={model}
            onChange={(e) =>
              changeModel(
                e.target.value
              )
            }
            disabled={!brand}
          >
            <option value="">
              {brand
                ? "Model"
                : "Alege marca"}
            </option>

            {models.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={year}
            onChange={(e) =>
              changeYear(
                e.target.value
              )
            }
            disabled={!model}
          >
            <option value="">
              {model
                ? "An"
                : "Alege modelul"}
            </option>

            {years.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={engine}
            onChange={(e) => {
              setEngine(
                e.target.value
              );

              setResult("");
              setVinError(false);
            }}
            disabled={!year}
          >
            <option value="">
              {year
                ? "Motorizare"
                : "Alege anul"}
            </option>

            {engines.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <button
            className="primary-btn"
            onClick={searchParts}
            disabled={
              !selectionComplete
            }
          >
            Caută piese
          </button>
        </div>

        <div className="vin-search">
          <span>sau</span>

          <input
            type="text"
            value={vin}
            maxLength={17}
            placeholder="Introdu seria VIN"
            onChange={(e) => {
              setVin(
                e.target.value
              );

              setResult("");
              setVinError(false);
            }}
          />

          <button
            onClick={identifyVin}
          >
            Identifică mașina
          </button>
        </div>

        <div className="search-note">
          ✓ Nu ai nevoie de cont
          pentru a căuta piese
        </div>
      </div>

      {result && (
        <div
          className={
            vinError
              ? "vehicle-result vehicle-result-error"
              : "vehicle-result"
          }
        >
          <span>
            {vinError
              ? "VERIFICĂ SERIA VIN"
              : "IDENTIFICARE VIN"}
          </span>

          <strong>
            {result}
          </strong>
        </div>
      )}
    </>
  );
}