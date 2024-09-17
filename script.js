function getWeather() {
    const apiKey = '3d433583aaab60a9392d8d31c8273600';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching current weather data');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            generateActivityRecommendations(data); // Call to generate activity recommendations
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching hourly forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const leftBox = document.getElementById('left-box');
    const adviceContainer = document.getElementById('advice-container');
    const clothingIcon = document.getElementById('clothing-icon');
    const rightBox = document.getElementById('right-box');
    const activityContainer = document.getElementById('activity-container');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    leftBox.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Determine clothing advice
        let clothingCode = 0;
        let clothingAdvice = '';
        if (description.includes("rain")) {
            clothingCode = 0;
            clothingAdvice = 'Make sure to wear a raincoat or bring an umbrella it is pouring outside!';
        } else if (temperature < 12) {
            clothingCode = 1;
            clothingAdvice = 'Super cold outside! Wear a jacket';
        } else if (temperature <= 22) {
            clothingCode = 2;
            clothingAdvice = 'Kind of chilly, consider wearing a sweater';
        } else {
            clothingCode = 3;
            clothingAdvice = 'Consider applying sunscreen before going out and bring those sunglasses';
        }

        clothingIcon.src = `./images/clothing${clothingCode}.png`;
        leftBox.innerHTML = `<p>${clothingAdvice}</p>`;
        adviceContainer.style.display = 'block';
        clothingIcon.style.display = 'block';
        leftBox.style.display = 'block';

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous content

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function generateActivityRecommendations(data) {
    const rightBox = document.getElementById('right-box');
    const activityContainer = document.getElementById('activity-container');
    const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
    const weatherDescription = data.weather[0].description.toLowerCase();

    let activityRecommendation = '';

    if (weatherDescription.includes('rain') || weatherDescription.includes('storm')) {
        activityRecommendation = 'It\'s rainy outside. How about watching a movie or visiting a museum?';
    } else if (temperature < 12) {
        activityRecommendation = 'It\'s quite cold. A cozy indoor activity like reading a book or going to a cafe sounds nice!';
    } else if (temperature <= 22) {
        activityRecommendation = 'Perfect weather for a walk in the park or exploring the city!';
    } else if (temperature > 22) {
        activityRecommendation = 'It\'s warm and sunny! Great day for a beach trip, hiking, or an outdoor picnic!';
    }

    // Display activity recommendation in the right-box
    rightBox.innerHTML = `<p>${activityRecommendation}</p>`;
    
    // Make sure the right-box and activity-container are visible
    rightBox.style.display = 'block';
    activityContainer.style.display = 'block';
}


function showImage() {
    const image = document.getElementById("weather-icon");
    if (image.src) {
        image.style.display = "block";
    } else {
        image.style.display = "none";
    }
}
