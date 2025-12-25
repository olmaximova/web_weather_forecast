import { getWeatherUrl } from './api_data.js';
import { WeatherData } from './weatherData.js';

export class WeatherService {
    
    static async getWeather(lat, lon) {
        const url = getWeatherUrl(lat, lon);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Ошибка запроса');
        const data = await res.json();
        return new WeatherData(data);
    }
    
    static async getWeatherForCity(cityName, cityService) {
        try {
            const coords = await cityService.getCityCoords(cityName);
            const weather = await this.getWeather(coords.lat, coords.lon);
            return {
                coords: coords,
                weather: weather,
                locationName: cityName
            };
        } catch {
            throw new Error('Не удалось получить погоду');
        }
    }
    
    static async getGeoWeather(geoService) {  
        try {
            const coords = await geoService.getCurrentCoords();
            const weather = await this.getWeather(coords.lat, coords.lon);
            return {
                coords: coords,
                weather: weather,
                locationName: 'Текущее местоположение'
            };
        } catch {
            throw new Error('Не удалось определить местоположение');
        }
    }
}