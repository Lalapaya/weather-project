function loadPageCity(city) {
    let apiKey = 'e008579254b3fba07df70d1e8db97913';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(changeTemperature);
}

function getLocalTime(lat, lon) {
    let apiKey = '01a39e21994c474c8af9a33ca6ce7e56';
    let apiUrl = `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&lat=${lat}&long=${lon}`;
    axios.get(apiUrl).then(changeLocalTime);
}

function changeLocalTime(response) {
    // console.log(response.data);
    let responseDay = response.data.date_time_txt;
    let day = responseDay.split(',');
    let responseTime = response.data.time_24;
    let time = responseTime.split(':');
    let output = day[0] + ', ' + time[0] + ':' + time[1];
    let date = document.querySelector('#date');
    date.innerText = output;
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
    return `${hours}:${minutes}`;
}

function changeTemperature(response) {
    console.log(response.data);
    let temperature = document.querySelector('#temperature');
    let cityHeading = document.querySelector('#city-heading');
    let skyCondition = document.querySelector('#sky-condition');
    let humidity = document.querySelector('#humidity');
    let windspeed = document.querySelector('#windspeed');
    let iconElement = document.querySelector('#icon');
    let updatedElement = document.querySelector('#updated');

    celsiusTemperature = response.data.main.temp;
    temperature.innerHTML = Math.round(celsiusTemperature);
    cityHeading.innerHTML = response.data.name;
    skyCondition.innerHTML = response.data.weather[0].main;
    humidity.innerHTML = response.data.main.humidity;
    windspeed.innerHTML = Math.round(response.data.wind.speed);
    iconElement.setAttribute('src', `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    updatedElement.innerHTML = currentDate(response.data.dt * 1000);

    getLocalTime(response.data.coord.lat, response.data.coord.lon);
    checkWeather(response.data.weather[0].main);
    displayForecast();
}

function handleSubmit(event) {
    event.preventDefault();
    let city = document.querySelector('#city-input').value;
    loadPageCity(city);
}

function getPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = 'e008579254b3fba07df70d1e8db97913';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(changeTemperature);
}

function startNavigator() {
    navigator.geolocation.getCurrentPosition(getPosition);
}

function changeToFahrenheit(event) {
    event.preventDefault();
    celsiusButton.classList.remove('active');
    fahrenheitButton.classList.add('active');
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    let temperature = document.querySelector('#temperature');
    temperature.innerHTML = Math.round(fahrenheitTemperature);
}

function changeToCelsius(event) {
    event.preventDefault();
    celsiusButton.classList.add('active');
    fahrenheitButton.classList.remove('active');
    let temperature = document.querySelector('#temperature');
    temperature.innerHTML = Math.round(celsiusTemperature);
}

function checkWeather(weather) {
    rainElement.classList.remove('rain', 'rainlightning');
    bodyElement.classList.remove('clear', 'dark', 'clouds', 'mist');
    snowflakesElement.style.visibility = 'hidden';
    if (weather == 'Thunderstorm') {
        rainElement.classList.add('rainlightning');
        bodyElement.classList.add('dark');
    } else if (weather == 'Rain' || weather == 'Drizzle') {
        rainElement.classList.add('rain');
        bodyElement.classList.add('dark');
    } else if (weather == 'Clouds') {
        bodyElement.classList.add('clouds');
    } else if (weather == 'Clear') {
        bodyElement.classList.add('clear');
    } else if (weather == 'Snow') {
        bodyElement.classList.add('mist');
        snowflakesElement.style.visibility = 'visible';
    } else {
        bodyElement.classList.add('mist');
    }
}

function displayForecast() {
    let forecastElement = document.querySelector('#forecast');

    let forecastHTML = '<div class="row" id="forecast">';
    let days = ['Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(function (day) {
        forecastHTML += `<div class="col-2 forecast-day" id="forecast">
            <h4 class="day">
                <span>${day}</span><br /><img src="http://openweathermap.org/img/wn/04n@2x.png" alt="" class="forecast-icon" />
                <br /><small>10°C</small> <small class="forecastDegreesLow">10°C</small>
            </h4>
        </div>`;
    });
    forecastHTML += '</div>';
    forecastElement.innerHTML = forecastHTML;
}

let celsiusTemperature = null;

let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSubmit);

let currentCityButton = document.querySelector('#current-city-button');
currentCityButton.addEventListener('click', startNavigator);

let fahrenheitButton = document.querySelector('#fahrenheit');
fahrenheitButton.addEventListener('click', changeToFahrenheit);

let celsiusButton = document.querySelector('#celsius');
celsiusButton.addEventListener('click', changeToCelsius);

let rainElement = document.querySelector('#rain');
let lightningElement = document.querySelector('#lightning');

let bodyElement = document.querySelector('body');

let snowflakesElement = document.querySelector('#snowflakes');
snowflakesElement.style.visibility = 'hidden';

loadPageCity('London');
