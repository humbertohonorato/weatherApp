export default async function getCurrentWeather(locationCoords) {

  const axios = require('axios');

  const lat = locationCoords.latitude;
  const log = locationCoords.longitude;

  var results = [];

  await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=0eb2f69d1c7717935e676e3bf24faacb`)
    .then(function (response) {

      const data = response.data;
      const locationName = (data.sys.country + ', ' + ' ' + data.name);
      const temperatureMin = data.main.temp_min;
      const temperatureMax = data.main.temp_max;
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      const currentTemperature = data.main.temp;

      const description = data.weather.description;

      results = [currentTemperature, temperatureMin, temperatureMax, locationName, wind, humidity, description];

    })
    .catch(function (error) {
      console.log(error);
    })

  return results;
}