import { CurrentWeather } from './currentWeather.js';
import { DailyForecast } from './dailyForecast.js';

export class WeatherData {
    constructor(apiResponse) {
        this.latitude = apiResponse.latitude;
        this.longitude = apiResponse.longitude;
        this.timezone = apiResponse.timezone;
        
        if (apiResponse.current) {
            this.current = new CurrentWeather(apiResponse.current);
        }
        
        this.dailyForecasts = [];
        if (apiResponse.daily && apiResponse.daily.time) {
            for (let i = 0; i < apiResponse.daily.time.length; i++) {
                this.dailyForecasts.push(new DailyForecast(apiResponse.daily, i));
            }
        }
    }
    
    get todayForecast() {
        return this.dailyForecasts[0] || null;
    }
    
    get threeDayForecast() {
        return this.dailyForecasts.slice(1, 4);
    }
    
    get isValid() {
        return this.current && this.dailyForecasts.length > 0;
    }
}