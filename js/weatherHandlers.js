import { WeatherService } from './weatherService.js';
import { CityService } from './cityService.js';
import { GeolocationService } from './geoLocation.js';
import { storage } from './utils.js';

export class WeatherHandlers {
    constructor(logic, ui) {
        this.logic = logic;
        this.ui = ui;
    }

    async addCity() {
        const name = this.ui.cityInp.value.trim();
        if (!name) return this.ui.errorMsg('Введите город', 'city');

        try {
            const validation = await CityService.validateCity(name);
            if (!validation.valid) return this.ui.errorMsg(validation.message, 'city');

            const cityCoords = await CityService.getCityCoords(name);

            if (this.logic.isCityAlreadyAdded(cityCoords) ||
                this.logic.cities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                return this.ui.errorMsg('Этот город уже есть в вашем списке', 'city');
            }

            this.ui.showLoad();
            this.logic.cities.push({ name, lat: cityCoords.lat, lon: cityCoords.lon });
            storage.set('cities', this.logic.cities);
            await this.logic.cityWeather(name);
            this.ui.cityInp.value = '';
            this.ui.hideCity();
        } catch (error) {
            this.ui.errorMsg('Не удалось добавить город', 'city');
            throw new Error(error);
        } finally {
            this.ui.hideLoad();
        }
    }

    async setCurrentLocation() {
        const name = this.ui.locInp.value.trim();
        if (!name) return this.ui.errorMsg('Введите город', 'loc');

        try {
            const validation = await CityService.validateCity(name);
            if (!validation.valid) return this.ui.errorMsg(validation.message, 'loc');

            const res = await WeatherService.getWeatherForCity(name, CityService);

            const existingCity = this.logic.findExistingCity(res.coords, name);
            if (existingCity) {
                this.logic.currentLocation = {
                    lat: existingCity.lat,
                    lon: existingCity.lon,
                    name: 'Текущее местоположение'
                };
                storage.set('currentLocation', this.logic.currentLocation);
            } else if (this.logic.isCityAlreadyAdded(res.coords)) {
                this.ui.errorMsg('Этот город уже есть в вашем списке', 'loc');
                return;
            } else {
                this.logic.currentLocation = {
                    lat: res.coords.lat,
                    lon: res.coords.lon,
                    name: 'Текущее местоположение'
                };
                storage.set('currentLocation', this.logic.currentLocation);
            }

            await this.logic.loadElements();
            this.ui.hideLocationForm();
        } catch (error) {
            this.ui.errorMsg('Не удалось установить местоположение', 'loc');
            throw new Error(error);
        }
    }

    async getCurrentLocation() {
        try {
            const data = await WeatherService.getGeoWeather(GeolocationService);

            this.logic.currentLocation = {
                lat: data.coords.lat,
                lon: data.coords.lon,
                name: 'Текущее местоположение'
            };
            storage.set('currentLocation', this.logic.currentLocation);

            await this.logic.loadElements();
            this.ui.hideLocationForm();
        } catch (error) {
            this.ui.showLocationForm();
            throw new Error(error)
        }
    }

    changeCurrentLocation() {
        this.logic.currentLocation = null;
        storage.remove('currentLocation');
        this.ui.showLocationForm();
    }
}
