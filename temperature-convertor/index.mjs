import readline from "node:readline/promises";
import units, {
  validateTemperatureInput,
  validateUnit,
} from "./conversion-utility.mjs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

printHelp();
let inputString = (await rl.question(`Input: `)).toLowerCase();

while (inputString !== "q" && inputString !== "quit") {
  const inputs = inputString.split(" ");

  try {
    if (inputs.length === 3) {
      const temp = parseFloat(inputs[0]);
      const fromUnit = inputs[1];
      const toUnit = inputs[2];

      const isTempValid = validateTemperatureInput(temp);
      const isFromUnitValid = validateUnit(fromUnit);
      const isToUnitValid = validateUnit(toUnit);

      if (!isTempValid || !isFromUnitValid || !isToUnitValid) {
        let message = isTempValid
          ? ""
          : `\nThe "Temperature" value is invalid. Please enter a valid number.`;
        message += isFromUnitValid
          ? ""
          : `\nThe "From Unit" is invalid. Please enter a valid temperature unit from given options.`;
        message += isToUnitValid
          ? ""
          : `\nThe "To Unit" is invalid. Please enter a valid temperature unit from given options.`;
        throw new Error(message);
      }

      const fromUnitLetter = fromUnit[0];
      const toUnitLetter = toUnit[0];

      const fromUnitObj = units[fromUnitLetter.toLocaleLowerCase()];
      const toUnitObj = units[toUnitLetter.toLocaleLowerCase()];

      const convertedTemp = fromUnitObj[`to${toUnitObj.shorthand}`](temp);
      console.log(
        `${temp.toFixed(2)} ${fromUnitObj.name} is ${convertedTemp.toFixed(
          2
        )} ${toUnitObj.name}\n`
      );
    } else {
      throw new Error(
        `Invalid amount(${inputs.length}) of arguments. Only 4 arguments are allowed.`
      );
    }
  } catch (err) {
    console.error(err.message);
    printHelp();
  }

  inputString = (await rl.question(`Input: `)).toLowerCase();
}

rl.close();

function printHelp() {
  console.log(`
Input: [Temperature] [From Unit] [To Unit]
Ex: 25 C Fahrenheit

Temperature:- A number
From Unit:- C, F, K or Celsius, Fahrenheit, Kelvin
From Unit:- C, F, K or Celsius, Fahrenheit, Kelvin

Exit the application by enter "q" or "quit"
  `);
}
