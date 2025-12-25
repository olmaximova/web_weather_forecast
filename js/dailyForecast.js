export class DailyForecast {
    constructor(data, index = 0) {
        this.date = data.time[index];
        this.maxTemperature = data.temperature_2m_max[index];
        this.minTemperature = data.temperature_2m_min[index];
    }

    get formattedMaxTemperature() {
        return this.maxTemperature !== undefined ? `${Math.round(this.maxTemperature)}°C` : '—';
    }

    get formattedMinTemperature() {
        return this.minTemperature !== undefined ? `${Math.round(this.minTemperature)}°C` : '—';
    }
}
