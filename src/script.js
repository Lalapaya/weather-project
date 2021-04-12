function loadPageCity(city) {
  let apiKey = "e008579254b3fba07df70d1e8db97913";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(changeTemperature);
}

function currentDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day}, ${hours}:${minutes}`;
}

function changeTemperature(response) {
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(response.data.main.temp);
  let cityHeading = document.querySelector("#city-heading");
  cityHeading.innerHTML = response.data.name;
  let skyCondition = document.querySelector("#sky-condition");
  skyCondition.innerHTML = response.data.weather[0].main;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let windspeed = document.querySelector("#windspeed");
  windspeed.innerHTML = Math.round(response.data.wind.speed);
  let date = document.querySelector("#date");
  date.innerHTML = currentDate(response.data.dt * 1000);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  loadPageCity(city);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "e008579254b3fba07df70d1e8db97913";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(changeTemperature);
}

function startNavigator() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", startNavigator);

loadPageCity("London");
