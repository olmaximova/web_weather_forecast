const CITIES_DATA_URL = 'data.json';

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
            console.error('Ошибка загрузки городов:', error);
            throw error;
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

        const city = await this.findCityByName(cityName);

        if (!city) {
            return { valid: false, message: 'Город не найден. Убедитесь в правильности написания' };
        }

        return { valid: true, city };
    }

}