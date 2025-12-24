export class CurrentWeather {
    constructor(data) {
        this.time = data.time; 
        this.interval = data.interval;
        this.temperature = data.temperature_2m; 
        this.humidity = data.relative_humidity_2m; 
        this.apparentTemperature = data.apparent_temperature; 
        this.isDay = data.is_day; 
    }
    
    get formattedTemperature() {
        return `${Math.round(this.temperature)}°C`;
    }
    
    get formattedFeelsLike() {
        return `${Math.round(this.apparentTemperature)}°C`;
    }
    
    get isDaytime() {
        return this.isDay === 1;
    }
}