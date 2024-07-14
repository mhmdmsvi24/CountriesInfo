import { printComponent, printCounter } from "../utils/element-modifiers";

const cardWrapper = document.querySelector(".countries__wrapper");
const searchBar = document.getElementById("search__bar--input");

// Fetch the API
function FetchCountries(url) {
  const req = new XMLHttpRequest();

  req.open("GET", url);
  req.send();

  return req;
}

function extractCountryData(data) {
  const {
    name: { common: countryName = "Unknown" } = {},
    flags: { svg: flagUrl = "" } = {},
    capital = [],
    population = 0,
    languages = {},
    currencies = {},
    region = "N/A",
    timezones = [],
  } = data;

  const language = Object.values(languages)[0] ?? "N/A";
  const currency = Object.values(currencies)[0] ?? {};
  const { name: currencyName = "N/A", symbol: currencySymbol = "N/A" } =
    currency;

  return {
    countryName,
    flagUrl,
    capital: capital[0] ?? "N/A",
    population: population ? `${(population / 1000000).toFixed(2)} M` : "N/A",
    language,
    currencyName,
    currencySymbol,
    region,
    timezone: timezones[0] ?? "N/A",
  };
}

function generateCountryHtml(countryData, single = false) {
  let processedData;

  if (single) {
    processedData = countryData;
  } else {
    const {
      name: { common: countryName = "Unknown" } = {},
      flags: { svg: flagUrl = "" } = {},
      capital = [],
      population = 0,
      languages = {},
      currencies = {},
      region = "N/A",
      timezones = [],
    } = countryData;

    const language = Object.values(languages).join(", ") || "N/A";
    const [currencyCode] = Object.keys(currencies);
    const { name: currencyName = "N/A", symbol: currencySymbol = "N/A" } =
      currencies[currencyCode] || {};
    const formattedPopulation = population
      ? `${(population / 1000000).toFixed(2)} M`
      : "N/A";

    processedData = {
      countryName,
      flagUrl,
      capital: capital[0] || "N/A",
      population: formattedPopulation,
      language,
      currencyName,
      currencySymbol,
      region,
      timezone: timezones[0] || "N/A",
    };
  }

  const {
    countryName,
    flagUrl,
    capital,
    population,
    language,
    currencyName,
    currencySymbol,
    region,
    timezone,
  } = processedData;

  return `
    <div class="countries__card" label="${countryName}">
      <div id="card__img" style="background-image: url(${flagUrl})"></div>
      <div class="card__body">
        <h3 class="card-desc card__name">${countryName}</h3>
        <div class="card-desc card__capital">Capital: <span>${capital}</span></div>
        <div class="card-desc card__population">Population: <span>${population}</span></div>
        <div class="card-desc card__lang">Language: <span>${language}</span></div>
        <div class="card-desc card__currency">Currencies: <span>${currencyName}</span></div>
        <div class="card-desc card__symbol">Currency Symbol: <span>${currencySymbol}</span></div>
        <div class="card-desc card__geo">Location: <span>${region}</span></div>
        <div class="card-desc card__timezone">Time zone: <span>${timezone}</span></div>
      </div>
    </div>
  `;
}

// Create the Component
function creatComponent(name) {
  let html = "";
  let data = "";
  let dataObj;

  // Data fetched from the API
  let request = "";

  // If a country name is specified from the search input show a single country
  if (name) {
    request = FetchCountries(`https://restcountries.com/v3.1/name/${name}`);

    request.onload = () => {
      if (request.status === 200) {
        data = extractCountryData(JSON.parse(request.responseText)[0]);
        html = generateCountryHtml(data, true);

        printCounter("-");
      } else {
        html = `
        <div>
        Invalid Country
        </div> 
      `;
      }

      printComponent(html, cardWrapper, true);
    };
    // if no name is specified list all of the countries
  } else {
    request = FetchCountries(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,population,languages,region,timezones"
    );

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        printComponent("", cardWrapper, true);
        data = JSON.parse(request.responseText);
        data.map((country) => {
          html = generateCountryHtml(country);
          printComponent(html, cardWrapper);
          printCounter(data.length);
        });
      }
    };
  }
}

// Search Bar
function searchDebouce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedGetCountry = searchDebouce(creatComponent, 1000);

searchBar.addEventListener("input", function () {
  const value = this.value;

  if (value) {
    debouncedGetCountry(value);
  } else {
    creatComponent();
  }
});

creatComponent();

export { creatComponent };
