const quoteElem = document.querySelector(".quote-widget__quote");
const authorElem = document.querySelector(".quote-widget__author");
const prevBtnElem = document.querySelector("#quote-widget__prev");
const nextBtnElem = document.querySelector("#quote-widget__next");
const randomBtnElem = document.querySelector("#quote-widget__random");

const quotes = await getQuotes();

let currentIndex = 0;

if (!quotes) {
  quoteElem.textContent = "404 not found!";
  authorElem.textContent = "Developer";
} else {
  updateElem();

  prevBtnElem.addEventListener("click", () => {
    const length = quotes.length;
    // JS modulo can return negative values.
    // So, -1 % 4 will be -1.
    // So, adding the length and modulo it again will give the current index.
    currentIndex = ((--currentIndex % length) + length) % length;
    updateElem();
  });

  nextBtnElem.addEventListener("click", () => {
    const length = quotes.length;
    currentIndex = ++currentIndex % length;
    updateElem();
  });

  randomBtnElem.addEventListener("click", () => {
    const min = 0;
    const max = quotes.length;
    const rand = Math.random();
    let index = Math.floor((max - min) * rand + min);
    currentIndex = currentIndex == index ? ++index % quotes.length : index;
    updateElem();
  });
}

function updateElem() {
  quoteElem.textContent = quotes[currentIndex].quote;
  authorElem.textContent = quotes[currentIndex].author;
}

async function getQuotes() {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const response = await fetch(
    "http://localhost:9000/data/quotes.json",
    options
  );
  if (response.status !== 200) {
    console.error("Failed to fetch quotes from server");
    return null;
  }
  return await response.json();
}
