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
            this.ui.showLoad();

            const validation = await CityService.validateCity(name);
            if (!validation.valid) {
                this.ui.hideLoad();
                return this.ui.errorMsg(validation.message, 'city');
            }

            const cityCoords = await CityService.getCityCoords(name);

            if (this.logic.isCityAlreadyAdded(cityCoords) ||
                this.logic.cities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                this.ui.hideLoad();
                return this.ui.errorMsg('Этот город уже есть', 'city');
            }

            this.logic.cities.push({
                name,
                lat: cityCoords.lat,
                lon: cityCoords.lon
            });
            storage.set('cities', this.logic.cities);

            await this.logic.cityWeather(name);

            this.ui.showSuccess('Город успешно добавлен');

            this.clearCityForm();
            this.ui.hideCity();

        } catch (error) {
            this.ui.errorMsg('Не удалось добавить', 'city');
        } finally {
            this.ui.hideLoad();
        }
    }

    clearCityForm() {
        if (this.ui.cityInp) {
            this.ui.cityInp.value = '';
        }
        if (this.ui.cityErr) {
            this.ui.cityErr.textContent = '';
        }
        this.ui.hideSuggestions();
    }

    async setCurrentLocation() {
        const name = this.ui.locInp.value.trim();
        if (!name) return this.ui.errorMsg('Введите город', 'loc');

        try {
            this.ui.showLoad();

            const validation = await CityService.validateCity(name);
            if (!validation.valid) {
                this.ui.hideLoad();
                return this.ui.errorMsg(validation.message, 'loc');
            }

            const res = await WeatherService.getWeatherForCity(name, CityService);
            await this.logic.setCurrentLocation(res.coords.lat, res.coords.lon, name);

            storage.set('currentLocation', {
                lat: res.coords.lat,
                lon: res.coords.lon,
                name: name
            });

            await this.logic.loadElements();

            this.ui.showSuccess('Местоположение установлено', `${name} установлен как текущее местоположение`);

            this.clearLocationForm();
            this.ui.hideLocationForm();

        } catch (error) {
            this.ui.errorMsg('Не удалось определить местоположение', 'loc');
        } finally {
            this.ui.hideLoad();
        }
    }

    async getCurrentLocation() {
        try {
            this.ui.showLoad();

            const data = await WeatherService.getGeoWeather(GeolocationService);
            await this.logic.setCurrentLocation(data.coords.lat, data.coords.lon);

            storage.set('currentLocation', {
                lat: data.coords.lat,
                lon: data.coords.lon,
                name: data.name || 'Текущее местоположение'
            });

            await this.logic.loadElements();

            this.ui.showSuccess(
                'Местоположение определено!',
                'Текущее местоположение определено автоматически.'
            );

            this.clearLocationForm();
            this.ui.hideLocationForm();

        } catch (error) {
            if (error.message.includes('Geolocation error') ||
                error.message.includes('Permission denied') ||
                error.message.includes('Geolocation request failed')) {
                this.ui.errorMsg('Не удалось определить ваше местоположение. Введите город вручную.', 'loc');
            } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                this.ui.errorMsg('Истекло время ожидания геолокации. Введите город вручную.', 'loc');
            } else {
                this.ui.errorMsg('Произошла ошибка. Попробуйте ввести город вручную.', 'loc');
            }
            storage.set('geolocationDenied', true);
            this.ui.showLocationForm();
        } finally {
            this.ui.hideLoad();
        }
    }

    changeCurrentLocation() {
        this.clearLocationForm();
        this.ui.showLocationForm();
    }

    clearLocationForm() {
        if (this.ui.locInp) {
            this.ui.locInp.value = '';
        }
        if (this.ui.locErr) {
            this.ui.locErr.textContent = '';
        }
        this.ui.hideSuggestions();
    }
}

