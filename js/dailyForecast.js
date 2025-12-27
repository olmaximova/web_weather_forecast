import { directions } from "./weather_data.js"; 

export class DailyForecast {
    constructor(data, index = 0) {
        this.date = data.time[index];
        this.maxTemperature = data.temperature_2m_max[index];
        this.minTemperature = data.temperature_2m_min[index];
        this.uvIndexMax = data.uv_index_max[index];
        this.precipProbabilityMax = data.precipitation_probability_max[index];
        this.windSpeedMax = data.wind_speed_10m_max[index];
        this.windDirection = data.wind_direction_10m_dominant[index];
    }

    get formattedMaxTemperature() {
        return this.maxTemperature !== undefined ? `${Math.round(this.maxTemperature)}°C` : '—';
    }

    get formattedMinTemperature() {
        return this.minTemperature !== undefined ? `${Math.round(this.minTemperature)}°C` : '—';
    }

    get formattedUVIndex() {
        return this.uvIndexMax !== undefined ? this.uvIndexMax.toFixed(1) : '—';
    }

    get formattedPrecipProbability() {
        return this.precipProbabilityMax !== undefined ? `${Math.round(this.precipProbabilityMax)}%` : '—';
    }

    get formattedWindSpeed() {
        return this.windSpeedMax !== undefined ? `${this.windSpeedMax.toFixed(1)} м/с` : '—';
    }

    get formattedWindDirection() {
        if (this.windDirection === undefined) return '—';
        const index = Math.round(this.windDirection / 45) % 8;
        return `${directions[index]}`;
    }
}

