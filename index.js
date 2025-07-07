// DOM 
const location_obj = document.getElementById('curr-location');
const date_obj = document.getElementById('date-day');
const curr_temp_obj = document.getElementById('curr-temp');
const curr_weather = document.getElementById('weather-cond');
const curr_weather_desc = document.getElementById('weather-cond-desc');
const sun_rise_time = document.getElementById('sunrise-time');
const sun_set_time =  document.getElementById('sunset-time');
const weather_param = document.querySelectorAll('.magnitude');
const air_parameter = document.querySelectorAll(".air-mag");
const air_quality_index = document.getElementById('air-quality-index');
const city_input = document.getElementById('city-input');
const date_for = document.querySelectorAll('.date-for');
const day_for = document.querySelectorAll('.day-for');
const temperatrue = document.querySelectorAll(".temp");
const weather_icon = document.querySelectorAll(".weather-icon");
const time_obj = document.querySelectorAll(".time");
const today_weather_time_icon = document.querySelectorAll(".weather-pic");
const today_time_temp = document.querySelectorAll(".time-temp");



// Array 
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const air_pollutant = ['co','no','no2','o3','so2','pm2_5','pm10','nh3']

const air_quality = ['Good', 'Fair', "Moderate",'Poor','Very Poor']

const air_quality_indicator = ["#00E400","#FFFF00","#FF7E00","#FF0000","#FF0000"]


const API_KEY = config.OPEN_WEATHER_API_KEY;

const getCurrentLocation = () => {
    console.log("getting current location...");
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }else{
        alert("Unable to identify Current location.");
    }
}

const success = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const curr_location_data = await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    displayContent(lat,lon);
}
  
const error = () => {
    alert("Unable to find current Location...!");
}

const findWeatherByLocation = async (latitude, longitude) => {
    const lat = latitude;
    const lon = longitude;

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    collectInfo(response.data);
}


// left side content
const locationInfo = async(data) => {
    const city_name = data['name'];
    const country_res = await axios.get(`https://restcountries.com/v3.1/alpha/${data['sys']['country']}`)
    const country_name = country_res.data[0]['name']['common']
    location_obj.innerText = (city_name + ', ' + country_name);
}
const dateDayInfo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const curr_date = date.getDate();
    const day = days[date.getDay()];
    date_obj.innerText = `${day}, ${curr_date} ${month} ${year}`;
}
const currentTemperature = (temp) => {
    curr_temp_obj.innerText = `${temp['temp']} °C`;
}
const currentWeather = (weather) => {
    curr_weather.innerText = `${weather['main']}`;
    curr_weather_desc.innerText = `${weather['description']}`;
}


// right side content
const suntiming = (sunRoute) => {
    const sunRise = new Date(sunRoute['sunrise'] * 1000);
    const sunSet = new Date(sunRoute['sunset']* 1000);
    sun_rise_time.innerText = sunRise.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true, 
});
    sun_set_time.innerText = sunSet.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true, 
});
}

const weatherParam = (parameter) => {
    weather_param[0].innerText = parameter['main']['humidity'] + "%"
    weather_param[1].innerText = parameter['main']['pressure'] + "hPa";
    weather_param[2].innerText = (parameter['visibility'] /1000).toFixed(1) + "km";
    weather_param[3].innerText = (parameter['wind']['speed'] ).toFixed(1) + "m/s"
    weather_param[4].innerText = parameter['main']['feels_like'] + "°C";
}

const findAirQuality = async (lat,lon) => {
    const air_data = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

    air_pollutant.forEach((pollutant,idx) => {
        air_parameter[idx].innerText = air_data['data']['list'][0]['components'][pollutant];
    })

    const air_qlt = air_data['data']['list'][0]['main']['aqi'];
    air_quality_index.innerText = air_quality[air_qlt - 1];
    air_quality_index.style.backgroundColor = air_quality_indicator[air_qlt - 1];

}

const collectInfo = async(data) => {
   locationInfo(data);
   dateDayInfo();
   currentTemperature(data['main'])
   currentWeather(data['weather'][0])
   suntiming(data['sys'])
   weatherParam(data)
}

const collectContent = (data) => {
    data.forEach((dataItem,idx) => {
        const date = dataItem['dt_txt'].split(" ")[0];
        const date_object = new Date(date);
        date_for[idx].innerText = date_object.getDate() + " " + months[date_object.getMonth()];
        day_for[idx].innerText = days[date_object.getDay()]
        temperatrue[idx].innerText = dataItem['main']['temp'] + "°C";
        const icon = dataItem['weather'][0]['icon']
        weather_icon[idx].src = `https://openweathermap.org/img/wn/${icon}.png`
    })
    
}

const bottomSection = (data) => {
    data.forEach((dataItem,idx)=>{
        today_time_temp[idx].innerText = dataItem['main']['temp'] + "°C";
        const icon = dataItem['weather'][0]['icon']
        today_weather_time_icon[idx].src=`https://openweathermap.org/img/wn/${icon}.png`
        const time = dataItem['dt_txt'].split(" ")[1];
        const time_slice = time.slice(0,2);
        time_obj[idx].innerText = time_slice < "12" && time_slice !== '00' ? (time_slice < 10 ? time_slice.slice(1,2) + " AM" : time_slice + " AM") : (time_slice > "12" ?(parseInt(time_slice) % 12 + " PM") : (time_slice ==="00" ? "12" + " AM": (time_slice + " PM")));

    });
}

const findnext5DaysInfo = async(lat,lon) => {
    const $5dayweather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

    const dataArray = $5dayweather['data']['list'];

    const todayData = dataArray.slice(0,8);

    const next5DayData = dataArray.filter((dataItem)=>{
        return (dataItem['dt_txt'].includes("12:00:00"))
    })
    collectContent(next5DayData);
    bottomSection(todayData);
}


const displayContent = (lat,lon) => {
    findWeatherByLocation(lat,lon)
    findAirQuality(lat,lon)
    findnext5DaysInfo(lat,lon)
}

const handleSearch = async (event) => {
    event.preventDefault();
    const city_name = city_input.value;
    const response = await axios(`https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=5&appid=${API_KEY}`)
    const data = response['data'][0]
    displayContent(data['lat'],data['lon']);
}

getCurrentLocation();





