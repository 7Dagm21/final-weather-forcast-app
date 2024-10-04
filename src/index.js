const apiKey = "775t5215o362facd07db64465329fca1";

// Function to format the date
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[day]} ${hours}:${minutes}`;
}

// Function to fetch weather data for the searched city
async function fetchWeather(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    updateWeatherUI(response.data);
    getForecast(response.data.city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    displayError("City not found. Please try again.");
  }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
  const temperature = Math.round(data.temperature.current);
  const cityName = data.city;

  document.querySelector("#current-city").innerHTML = cityName;
  document.querySelector("#temperature").innerHTML = `${temperature}`;
  document.querySelector("#description").innerHTML = data.condition.description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${data.temperature.humidity}%`;
  document.querySelector("#wind").innerHTML = `${data.wind.speed} km/h`;
  document.querySelector(
    "#icon"
  ).innerHTML = `<img src="${data.condition.icon_url}" class="current-temperature-icon" />`;

  // Set the current date
  document.querySelector("#current-date").innerHTML = formatDate(new Date());
}

// Function to handle form submission
function search(event) {
  event.preventDefault();
  const searchInputElement = document.querySelector("#search-input");
  const city = searchInputElement.value.trim();

  if (city) {
    fetchWeather(city);
    searchInputElement.value = ""; // Clear input field
  }
}

// Function to display error messages
function displayError(message) {
  const errorElement = document.querySelector("#error-message");
  errorElement.innerHTML = message;
}

// Function to fetch the forecast
async function getForecast(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  try {
    const response = await axios.get(apiUrl);
    displayForecast(response.data);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Function to display the forecast
function displayForecast(data) {
  let forecastHtml = "";

  data.daily.forEach((day, index) => {
    if (index < 7) {
      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(day.temperature.maximum)}º</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(
              day.temperature.minimum
            )}º</div>
          </div>
        </div>`;
    }
  });

  document.querySelector("#forecast").innerHTML = forecastHtml;
}

// Function to format days
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

// Add event listener to the search form
document.querySelector("#search-form").addEventListener("submit", search);

// Initial fetch for a default city
fetchWeather("Addis Ababa");
