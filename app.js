/****************** Google Maps API ********************** */

let map;
let marker;
let autocomplete;
const colCords = { lat: 4.8, lng: -75.6 };
const input = document.getElementById("autocomplete");

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: colCords,
    zoom: 8
  });
  marker = new google.maps.Marker({
    position: colCords,
    map: map
  });
  initAutocomplete();
}

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(input, 
    { types: ["(cities)"] }
  );
  autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
  let place = autocomplete.getPlace();

  if (!place.geometry) {
    document.getElementById("autocomplete").placeholder = "Enter a city";
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(10);
    marker.setPosition(place.geometry.location);
  }
}

/****************** OpenWeather API ********************** */

const weatherForm = document.querySelector('.weather-form');
const getCity = document.querySelector('.search-button');
const card = document.querySelector('.card');
const apiKey = '6e3791aa88851a5580fa209465275cce';

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = input.value;
  weatherForm.reset();

  if (city) {
    try{
      const weatherData = await getWeatherData(city);
      displayInfo(weatherData);
    } catch(err) {
      console.error(err);
    }
  } else {
    alert('Please enter a city');
  }
});

const getWeatherData = async (city) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    return data;
  
  } catch (err) {
    throw new Error('No data found');
  }
}

const displayInfo = (data) => {
  const { 
      name, 
      main: {temp, humidity}, 
      weather: [{description}] } = data;

  card.innerHTML = `
    <h1 class="city-display">${name}</h1>
    <p class="temp-display">${(temp - 273.15).toFixed(1)}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Description: ${description}</p>
  `;
  card.style.display = 'block';
  card.classList.add('card');
}