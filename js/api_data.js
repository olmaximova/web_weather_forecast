export const getWeatherUrl = (long, lat) => {
    return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day&wind_speed_unit=ms`
}
export const CITY_JSON = 'https://raw.githubusercontent.com/arbaev/russia-cities/refs/heads/master/russia-cities.json'
