import { CITY_JSON } from "./api_data.js";

export class CityService {
    static cities = null;

    static async loadCities() {
        if (this.cities) {
            return this.cities;
        }

        try {
            const response = await fetch(CITY_JSON);
            const data = await response.json();

            this.cities = data.map(city => ({
                id: city.id,
                name: city.name,
                lat: city.coords.lat,
                lon: city.coords.lon,
                fullData: city
            }));

            return this.cities;
        } catch (error) {
            throw new Error('Failed to load');
        }
    }

    static async findCityByName(cityName) {
        const cities = await this.loadCities();
        const searchName = cityName.toLowerCase().trim();

        return cities.find(city =>
            city.name.toLowerCase() === searchName
        ) || null;
    }

    static async getCityCoords(cityName) {
        const city = await this.findCityByName(cityName);

        if (!city) {
            throw new Error(`"${cityName}" not found`);
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
            return { valid: false, message: 'Choose a city' };
        }

        const city = await this.findCityByName(cityName);

        if (!city) {
            return {
                valid: false,
                message: 'Citu not found'
            };
        }

        return { valid: true, city };
    }
}