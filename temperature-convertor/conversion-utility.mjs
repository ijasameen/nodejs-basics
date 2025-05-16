const units = {
  c: {
    name: "Celsius",
    shorthand: "C",
    toC(value) {
      return value;
    },
    toF(value) {
      return value * (9 / 5) + 32;
    },
    toK(value) {
      return value + 273.15;
    },
  },
  f: {
    name: "Farhenheit",
    shorthand: "F",
    toC(value) {
      return (value - 32) * (5 / 9);
    },
    toF(value) {
      return value;
    },
    toK(value) {
      return this.toC(value) + 273.15;
    },
  },
  k: {
    name: "Kelvin",
    shorthand: "K",
    toC(value) {
      return value - 273.15;
    },
    toF(value) {
      return this.toC(value) * (9 / 5) + 32;
    },
    toK(value) {
      return value;
    },
  },
};

let regex = initRegex();

function initRegex() {
  let shorthandsString = "";
  let namesString = "";
  for (let key in units) {
    const unit = units[key];

    shorthandsString += `${unit.shorthand}`;
    namesString += `${unit.name}|`;
  }
  namesString = namesString.slice(0, namesString.length - 1);
  const regex = new RegExp(`^[${shorthandsString}]|(?:${namesString})$`, "i");
  return regex;
}

function validateTemperatureInput(value) {
  return isNaN(value) === false;
}

function validateUnit(value) {
  if (regex == null) initRegex();
  return regex.test(value);
}

export default units;
export { validateTemperatureInput, validateUnit };
