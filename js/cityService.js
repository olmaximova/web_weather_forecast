import { CITIES_DATA_URL } from './api_data.js'

export class CityService {
    static cities = null;

    static async loadCities() {
        if (this.cities) {
            return this.cities;
        }

        try {
            const response = await fetch(CITIES_DATA_URL);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: HTTP ${response.status}`);
            }
            const data = await response.json();

            this.cities = data.map(city => ({
                name: city.name,
                lat: city.coords.lat,
                lon: city.coords.lon
            }));

            return this.cities;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    static async findCityByName(cityName) {
        const cities = await this.loadCities();
        const searchName = cityName.toLowerCase().trim();

        return cities.find(city =>
            city.name.toLowerCase() === searchName) || null;
    }

    static async getCityCoords(cityName) {
        const city = await this.findCityByName(cityName);

        if (!city) {
            throw new Error(`Город "${cityName}" не найден`);
        }

        return {
            lat: city.lat,
            lon: city.lon,
            name: city.name
        };
    }

    static async getSuggestions(searchText) {
        const cities = await this.loadCities();

        if (!searchText || searchText.trim().length < 2) {
            return [];
        }

        const searchLower = searchText.toLowerCase().trim();

        return cities
            .filter(city => city.name.toLowerCase().includes(searchLower))
            .slice(0, 10)
            .map(city => city.name);
    }

    static async validateCity(cityName) {
        if (!cityName || cityName.trim().length < 2) {
            return { valid: false, message: 'Введите название города' };
        }

        try {
            const city = await this.getCityCoords(cityName);
            return {
                valid: true,
                message: 'Город найден',
                coords: city
            };
        } catch (error) {
            return { valid: false, message: 'Город не найден. Убедитесь в правильности написания' };
        }
    }

}