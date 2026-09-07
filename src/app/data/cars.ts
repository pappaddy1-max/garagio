export type CarDatabase = {
  [brand: string]: {
    [model: string]: {
      [year: string]: string[];
    };
  };
};

export const cars: CarDatabase = {
  BMW: {
    "Seria 3": {
      "2018": [
        "318d 150 CP",
        "320d 190 CP",
        "320i 184 CP",
        "330i 252 CP",
      ],
      "2019": [
        "318d 150 CP",
        "320d 190 CP",
        "320i 184 CP",
        "330i 258 CP",
      ],
      "2020": [
        "318d 150 CP",
        "320d 190 CP",
        "320i 184 CP",
        "330e Plug-in Hybrid",
      ],
    },

    "Seria 5": {
      "2018": [
        "520d 190 CP",
        "530d 265 CP",
        "530i 252 CP",
        "540i 340 CP",
      ],
      "2019": [
        "520d 190 CP",
        "530d 265 CP",
        "530i 252 CP",
        "540i 340 CP",
      ],
      "2020": [
        "520d 190 CP",
        "530d 286 CP",
        "530e Plug-in Hybrid",
      ],
    },

    X3: {
      "2019": [
        "xDrive20d 190 CP",
        "xDrive30d 265 CP",
        "xDrive30i 252 CP",
      ],
      "2020": [
        "xDrive20d 190 CP",
        "xDrive30d 286 CP",
        "xDrive30e Plug-in Hybrid",
      ],
    },
  },

  Audi: {
    A4: {
      "2018": [
        "2.0 TDI 150 CP",
        "2.0 TDI 190 CP",
        "2.0 TFSI 190 CP",
      ],
      "2019": [
        "35 TDI 150 CP",
        "40 TDI 190 CP",
        "40 TFSI 190 CP",
      ],
      "2020": [
        "35 TDI 163 CP",
        "40 TDI 190 CP",
        "40 TFSI 204 CP",
      ],
    },

    A6: {
      "2019": [
        "40 TDI 204 CP",
        "45 TDI 231 CP",
        "45 TFSI 245 CP",
      ],
      "2020": [
        "40 TDI 204 CP",
        "45 TDI 231 CP",
        "50 TDI 286 CP",
      ],
    },

    Q5: {
      "2019": [
        "35 TDI 163 CP",
        "40 TDI 190 CP",
        "45 TFSI 245 CP",
      ],
      "2020": [
        "40 TDI 204 CP",
        "45 TFSI 245 CP",
        "50 TFSI e Plug-in Hybrid",
      ],
    },
  },

  Volkswagen: {
    Golf: {
      "2018": [
        "1.0 TSI 110 CP",
        "1.5 TSI 150 CP",
        "1.6 TDI 115 CP",
        "2.0 TDI 150 CP",
      ],
      "2019": [
        "1.0 TSI 115 CP",
        "1.5 TSI 150 CP",
        "1.6 TDI 115 CP",
        "2.0 TDI 150 CP",
      ],
      "2020": [
        "1.0 TSI 110 CP",
        "1.5 eTSI 150 CP",
        "2.0 TDI 150 CP",
        "GTI 245 CP",
      ],
    },

    Passat: {
      "2018": [
        "1.6 TDI 120 CP",
        "2.0 TDI 150 CP",
        "2.0 TDI 190 CP",
        "1.8 TSI 180 CP",
      ],
      "2019": [
        "1.6 TDI 120 CP",
        "2.0 TDI 150 CP",
        "2.0 TDI 190 CP",
      ],
      "2020": [
        "2.0 TDI 150 CP",
        "2.0 TDI 200 CP",
        "GTE Plug-in Hybrid",
      ],
    },

    Tiguan: {
      "2019": [
        "1.5 TSI 150 CP",
        "2.0 TDI 150 CP",
        "2.0 TDI 190 CP",
      ],
      "2020": [
        "1.5 TSI 150 CP",
        "2.0 TDI 150 CP",
        "2.0 TDI 200 CP",
      ],
    },
  },

  "Mercedes-Benz": {
    "Clasa C": {
      "2018": [
        "C 180",
        "C 200",
        "C 220 d",
        "C 300",
      ],
      "2019": [
        "C 180",
        "C 200",
        "C 220 d",
        "C 300 d",
      ],
      "2020": [
        "C 180",
        "C 200",
        "C 220 d",
        "C 300 e Plug-in Hybrid",
      ],
    },

    "Clasa E": {
      "2018": [
        "E 200",
        "E 220 d",
        "E 300",
        "E 350 d",
      ],
      "2019": [
        "E 200",
        "E 220 d",
        "E 300 d",
        "E 450",
      ],
      "2020": [
        "E 200",
        "E 220 d",
        "E 300 de Plug-in Hybrid",
      ],
    },

    GLC: {
      "2019": [
        "GLC 200",
        "GLC 220 d",
        "GLC 300 d",
      ],
      "2020": [
        "GLC 200",
        "GLC 220 d",
        "GLC 300 e Plug-in Hybrid",
      ],
    },
  },

  Tesla: {
    "Model 3": {
      "2021": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2022": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2023": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2024": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2025": [
        "RWD",
        "Long Range RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2026": [
        "RWD",
        "Long Range RWD",
        "Long Range AWD",
        "Performance",
      ],
    },

    "Model Y": {
      "2022": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2023": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2024": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2025": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
      "2026": [
        "RWD",
        "Long Range AWD",
        "Performance",
      ],
    },
  },
};

export function getBrands() {
  return Object.keys(cars);
}

export function getModels(brand: string) {
  if (!brand || !cars[brand]) {
    return [];
  }

  return Object.keys(cars[brand]);
}

export function getYears(
  brand: string,
  model: string
) {
  if (
    !brand ||
    !model ||
    !cars[brand] ||
    !cars[brand][model]
  ) {
    return [];
  }

  return Object.keys(
    cars[brand][model]
  ).sort(
    (a, b) =>
      Number(b) - Number(a)
  );
}

export function getEngines(
  brand: string,
  model: string,
  year: string
) {
  if (
    !brand ||
    !model ||
    !year ||
    !cars[brand] ||
    !cars[brand][model] ||
    !cars[brand][model][year]
  ) {
    return [];
  }

  return cars[brand][model][year];
}