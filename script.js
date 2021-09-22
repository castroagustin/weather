const resultSection = document.querySelector('.resultSection');
const dailySection = document.querySelector('.dailyWeather');
const hourlySection = document.querySelector('.hourlyWeather');

const weatherNameResult = document.querySelector('.weatherCityNameResult');
const weatherCountryResult = document.querySelector('.weatherCountryResult');
const weatherDegreesResult = document.querySelector('.weatherDegreesResult');
const weatherIconResult = document.querySelector('.weatherIconResult');
const weatherMinResult = document.querySelector('.weatherMinResult');
const weatherMaxResult = document.querySelector('.weatherMaxResult');
const weatherRealFeelResult = document.querySelector('.weatherRealFeelResult');
const weatherDescriptionResult = document.querySelector(
  '.weatherDescriptionResult'
);

const weatherSearch = document.querySelector('.weatherSearch');
const weatherSearchButton = document.querySelector('.weatherSearchButton');
const weatherError = document.querySelector('.weatherError');

const infoIcon = document.querySelector('.infoIcon');

const topCities = document.querySelector('.topCities');

let cities = [
  'paris',
  'london',
  'buenos aires',
  'tokio',
  'madrid',
  'new york',
  'moscow',
];
cities = cities.sort(function () {
  return Math.random() - 0.5;
});

for (let i = 1; i <= 3; i++) {
  const weatherNameTopCities = document.querySelector(`.weatherCityName${i}`);
  const weatherCountryTopCities = document.querySelector(`.weatherCountry${i}`);
  const weatherDegreesTopCities = document.querySelector(`.weatherDegrees${i}`);
  const weatherIconTopCities = document.querySelector(`.weatherIcon${i}`);
  const weatherMinTopCities = document.querySelector(`.weatherMin${i}`);
  const weatherMaxTopCities = document.querySelector(`.weatherMax${i}`);
  const weatherRealFeelTopCities = document.querySelector(
    `.weatherRealFeel${i}`
  );
  const weatherDescriptionTopCities = document.querySelector(
    `.weatherDescription${i}`
  );
  const citiesData = function (url) {
    fetch(url)
      .then(Response => Response.json())
      .then(data => {
        weatherNameTopCities.textContent = `${data.name},`;
        weatherCountryTopCities.textContent = data.sys.country;
        weatherDegreesTopCities.textContent = data.main.temp.toFixed();
        weatherIconTopCities.src = `assets/${data.weather[0].icon}.svg`;
        weatherMinTopCities.textContent = `${data.main.temp_min.toFixed()}°`;
        weatherMaxTopCities.textContent = `${data.main.temp_max.toFixed()}°`;
        weatherRealFeelTopCities.textContent = `${data.main.feels_like.toFixed()}°`;
        weatherDescriptionTopCities.textContent = data.weather[0].description;
      });
  };

  if (i == 1) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cities[0]}&lang=sp&units=metric&appid=516a3639b767a6a2df1e6314740cfada`;
    citiesData(url);
  } else if (i == 2) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cities[1]}&lang=sp&units=metric&appid=516a3639b767a6a2df1e6314740cfada`;
    citiesData(url);
  } else if (i == 3) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cities[2]}&lang=sp&units=metric&appid=516a3639b767a6a2df1e6314740cfada`;
    citiesData(url);
  }
}

const body = document.querySelector('body');
const header = document.querySelector('.header');

let weatherSearchResult;

weatherSearch.addEventListener('focus', function () {
  weatherSearchButton.style.color = '#fff';
});
weatherSearch.addEventListener('blur', function () {
  weatherSearchButton.style.color = '#fff7';
});

weatherSearchButton.addEventListener('click', function () {
  weatherSearchResult = weatherSearch.value;
  weatherError.classList.add('hidden');
  weatherSearch.blur();
  connectApi();
});
weatherSearch.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    weatherSearchResult = weatherSearch.value;
    weatherError.classList.add('hidden');
    weatherSearch.blur();
    connectApi();
  }
});

const search = function () {};

// conexion con API CurrentWeather
const connectApi = function () {
  const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${weatherSearchResult}&lang=sp&units=metric&appid=516a3639b767a6a2df1e6314740cfada`;

  fetch(urlCurrent)
    .then(Response => Response.json())
    .then(data => {
      if (data.name) {
        resultSection.classList.remove('hidden');
        dailySection.classList.remove('hidden');
        topCities.classList.add('hidden');
      }
      if (data.weather[0].icon === '01d' || data.weather[0].icon === '02d') {
        body.style.background =
          'linear-gradient(192.04deg, #FFB800 0%, #D75127 100%)';
        header.style.backgroundColor = '#FFC56D';
        weatherSearch.style.backgroundColor = '#FFDB96';
      } else if (
        data.weather[0].icon === '03d' ||
        data.weather[0].icon === '04d' ||
        data.weather[0].icon === '09d' ||
        data.weather[0].icon === '10d' ||
        data.weather[0].icon === '11d' ||
        data.weather[0].icon === '13d' ||
        data.weather[0].icon === '50d'
      ) {
        body.style.background =
          'linear-gradient(192.04deg, #0094FF 0%, #2546BD 100%)';
        header.style.backgroundColor = '#3CA1EA';
        weatherSearch.style.backgroundColor = '#6EBBF2';
      } else {
        body.style.background =
          'linear-gradient(192.04deg,#0094ff 0%,#5f7da0 0.01%,#2a4667 100%)';
        header.style.backgroundColor = '#728eae';
        weatherSearch.style.backgroundColor = '#90a8c2';
      }
      console.log(data);
      weatherNameResult.textContent = `${data.name},`;
      weatherCountryResult.textContent = data.sys.country;
      weatherDegreesResult.textContent = data.main.temp.toFixed();
      weatherIconResult.src = `assets/${data.weather[0].icon}.svg`;
      weatherRealFeelResult.textContent = `${data.main.feels_like.toFixed()}°`;
      weatherDescriptionResult.textContent = data.weather[0].description;

      let weatherLat = data.coord.lat;
      let weatherLon = data.coord.lon;

      connectApiHourly(weatherLat, weatherLon);
    })
    .catch(err => weatherError.classList.remove('hidden'));
};

// Conexion con la API OneCall (HOURLY DATA)

const connectApiHourly = function (lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=7526268af62043cb0a4b0169246cd3b0`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log(data.timezone);
      weatherMinResult.textContent = `${data.daily[0].temp.min.toFixed()}°`;
      weatherMaxResult.textContent = `${data.daily[0].temp.max.toFixed()}°`;

      infoButton(data.timezone);
      for (let i = 1; i <= 5; i++) {
        const weatherDay = document.querySelector(`.weatherDay${i}`);
        const weatherDayIcon = document.querySelector(`.weatherDayIcon${i}`);

        let miliseconds = data.daily[i].dt * 1000;
        const dateObjet = new Date(miliseconds);
        const dayName = dateObjet.toLocaleString('es-AR', { weekday: 'long' });
        weatherDay.textContent = dayName.substring(0, 3);

        weatherDayIcon.src = `assets/${data.daily[i].weather[0].icon}.svg`;
      }

      const hourlyContainer = document.querySelector(
        '.hourlyWeather__container'
      );
      hourlyContainer.innerHTML = '';
      const hourlyFragment = document.createDocumentFragment();

      for (let i = 1; i <= 12; i++) {
        const hourlyElements = document.createElement('div');

        let miliseconds = data.hourly[i].dt * 1000;
        const dateObjet = new Date(miliseconds);
        const hourValue = dateObjet.toLocaleString('es-AR', {
          hour: 'numeric',
        });
        const dayName = dateObjet.toLocaleString('es-AR', { weekday: 'long' });
        hourlyElements.className = 'hourlyElementsContainer';
        if (hourValue == 0) {
          const dateHourlyContainer = document.createElement('div');
          dateHourlyContainer.innerHTML += `
          <div class='dayNameHourlyContainer'>
          <span>${dayName}</span>
          </div>`;
          hourlyFragment.appendChild(dateHourlyContainer);
        }
        hourlyElements.innerHTML += `
          <div class='hourlyTimeContainer'><span class='hourlyTime'>${hourValue}</span><span> hs</span></div>
        `;
        hourlyElements.innerHTML += `
        <span class='hourlyTemp'> ${data.hourly[i].temp.toFixed()}° </span>`;

        hourlyElements.innerHTML += `
          <img class='hourlyIcon' src= 'assets/${data.hourly[i].weather[0].icon}.svg'>
        `;
        hourlyFragment.appendChild(hourlyElements);
      }

      hourlyContainer.appendChild(hourlyFragment);
    });
};

const infoButton = function (zona) {
  const modal = document.querySelector('.modal');
  const closeModal = document.querySelector('.close-modal');
  const overlay = document.querySelector('.overlay');

  const zoneDetails = document.querySelector('.weatherDetailsZone');
  infoIcon.addEventListener('click', function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    zonaFormat = zona.split('_').join(' ');
    zoneDetails.textContent = zonaFormat;
  });

  closeModal.addEventListener('click', function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  });
};
