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

            this.ui.showSuccess('Город успешно добавлен!');

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

            let successMessage = '';
            let successDetails = '';

            const existingCity = this.logic.findExistingCity(res.coords, name);
            if (existingCity) {
                this.logic.currentLocation = {
                    lat: existingCity.lat,
                    lon: existingCity.lon,
                    name: 'Текущее местоположение'
                };
                storage.set('currentLocation', this.logic.currentLocation);
                successMessage = 'Местоположение обновлено!';
                successDetails = `${name} установлен как текущее местоположение.`;
            } else if (this.logic.isCityAlreadyAdded(res.coords)) {
                this.ui.hideLoad();
                this.ui.errorMsg('Этот город уже есть', 'loc');
                return;
            } else {
                this.logic.currentLocation = {
                    lat: res.coords.lat,
                    lon: res.coords.lon,
                    name: 'Текущее местоположение'
                };
                storage.set('currentLocation', this.logic.currentLocation);
                successMessage = 'Местоположение установлено!';
                successDetails = `Текущее местоположение установлено на ${name}.`;
            }

            await this.logic.loadElements();

            this.ui.showSuccess(successMessage, successDetails);

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

            this.logic.currentLocation = {
                lat: data.coords.lat,
                lon: data.coords.lon,
                name: 'Текущее местоположение'
            };
            storage.set('currentLocation', this.logic.currentLocation);

            await this.logic.loadElements();

            this.ui.showSuccess(
                'Местоположение определено!',
                'Ваше текущее местоположение определено автоматически.'
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

            this.ui.showLocationForm();
        } finally {
            this.ui.hideLoad();
        }
    }

    changeCurrentLocation() {
        this.logic.currentLocation = null;
        storage.remove('currentLocation');

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
