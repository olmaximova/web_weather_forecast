import { CITIES_DATA_URL } from './api_data.js';

export class CityService {
    static cities = null;

    static async loadCities() {
        if (this.cities) return this.cities;

        const response = await fetch(CITIES_DATA_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        this.cities = data.map(({ name, coords: { lat, lon } }) => ({ name, lat, lon }));
        return this.cities;
    }

    static async getCityCoords(cityName) {
        const cities = await this.loadCities();
        const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase().trim());

        if (!city) throw new Error(`Город "${cityName}" не найден`);
        return city;
    }

    static async getSuggestions(searchText) {
        if (searchText.trim().length < 2) return [];   // пусть пользователь введет хотя бы две буквы, прежде чем ему будем подсказки выдавать

        const cities = await this.loadCities();
        return cities
            .filter(city => city.name.toLowerCase().includes(searchText.toLowerCase().trim()))
            .slice(0, 10)
            .map(city => city.name);
    }

    static async validateCity(cityName) {
        if (!cityName?.trim() || cityName.trim().length < 2) {
            return { valid: false, message: 'Введите название города (минимум 2 символа)' };
        }

        try {
            await this.getCityCoords(cityName);
            return { valid: true, message: 'Город найден' };
        } catch {
            return { valid: false, message: 'Город не найден' };
        }
    }
}
