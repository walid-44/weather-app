const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const currentTempEl = document.getElementById("current-temp");
const searchIn = document.querySelector(".search_input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const weatherCardsDiv = document.querySelector(".weather-forecasts");
const currentCardsDiv = document.querySelector(".today");
const API_KEY = "61934d4e6cd376dea6881ab8af59c763";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12 = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "pm" : "Am";
  timeEl.innerHTML =
    (hoursIn12 < 10 ? `0${hoursIn12}` : hoursIn12) +
    ":" +
    (minutes < 10 ? `0${minutes}` : minutes) +
    "" +
    `<span id="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + " , " + date + "  " + months[month];
}, 1000);

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `
    <img src="https://openweathermap.org/img/wn/${
      weatherItem.weather[0].icon
    }@4x.png" alt="weather icon" class="w-icon">
    <div class="outher">
      <div class="day">${weatherItem.dt_txt.split(" ")[0]}</div>
      <div class="temp">Temp - ${(weatherItem.main.temp - 273.15).toFixed(
        2
      )}&#176;c</div>
        <div class="temp">wind - ${weatherItem.wind.speed} M/S</div>
        <div class="temp">Humidity -  ${weatherItem.main.humidity}%</div>
    </div>
        `;
  } else {
    return `<div class="weather-forecast-item">
            <div class="day">${weatherItem.dt_txt.split(" ")[0]}</div>
            <img src="https://openweathermap.org/img/wn/${
              weatherItem.weather[0].icon
            }@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Temp - ${(weatherItem.main.temp - 273.15).toFixed(
              2
            )}&#176;c</div>
        <div class="temp">wind - ${weatherItem.wind.speed}M/S</div>
        <div class="temp">Humidity -  ${weatherItem.main.humidity}%</div>
            </div>`;
  }
};
const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((date) => {
      // console.log("walid", date);
      const uniqueForecastDays = [];
      const fiveDays = date.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // console.log(fiveDays);
      // searchIn.value = ;
      weatherCardsDiv.innerHTML = " ";
      currentCardsDiv.innerHTML = " ";

      fiveDays.forEach((weatherItem, index) => {
        if (index === 0) {
          currentCardsDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardsDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert("An error");
    });
};
const getCityCoordinates = () => {
  const cityName = searchIn.value.trim();
  if (!cityName) return;
  const API_URl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;
  fetch(API_URl)
    .then((res) => res.json())
    .then((date) => {
      if (!date.length) return alert(`No Coordinates Found For ${cityName}`);
      // console.log("date", date);
      timeZone.innerHTML = date[0].name;
      const { name, lat, lon } = date[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates !");
    });
};
const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const GEOLOCATION_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(GEOLOCATION_URL)
        .then((res) => res.json())
        .then((date) => {
          // console.log(date);
          timeZone.innerHTML = date[0].local_names.tr;
          const { name } = date[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occurred while fetching the city !");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied . please reset location permission to grant access again"
        );
      }
    }
  );
};
searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
searchIn.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
