import { WeatherService } from './weatherService.js';
import { CityService } from './cityService.js';
import { waitGap, checkCoords, storage } from './utils.js';
import { WeatherCard } from './weatherCard.js';

export class WeatherLogic {
    constructor(cities, currentLocation, container, ui) {
        this.cities = cities;
        this.currentLocation = currentLocation;
        this.container = container;
        this.ui = ui;
    }

    async showCurrentLocationWeather() {
        try {
            const w = await WeatherService.getWeather(this.currentLocation.lat, this.currentLocation.lon);
            this.makeCard(w, 'Текущее местоположение', true);
        } catch (error) {
            throw error;
        }
    }

    async cityWeather(name) {
        try {
            const res = await WeatherService.getWeatherForCity(name, CityService);
            if (this.currentLocation &&
                Math.abs(this.currentLocation.lat - res.coords.lat) < 0.1 &&
                Math.abs(this.currentLocation.lon - res.coords.lon) < 0.1) {
                return;
            }
            this.makeCard(res.weather, name, false);
        } catch (error) {
            this.ui.errorMsg(`Ошибка загрузки: ${name}`);
        }
    }

    makeCard(data, name, isCurrentLocation) {
        const card = new WeatherCard(data, name, isCurrentLocation);
        this.container.appendChild(card.getElement());

        if (!isCurrentLocation) {
            card.setRemoveCallback(() => {
                this.delCity(name);
                card.getElement().remove();
            });
        }
    }

    delCity(name) {
        this.cities = this.cities.filter(c => c.name !== name);
        storage.set('cities', this.cities);
    }

    isCityAlreadyAdded(coords) {
        if (this.currentLocation && checkCoords(this.currentLocation, coords)) return true;
        for (const city of this.cities) {
            const cityCoords = city.lat && city.lon ? { lat: city.lat, lon: city.lon } : null;
            if (cityCoords && checkCoords(cityCoords, coords)) return true;
        }
        return false;
    }

    findExistingCity(coords, name) {
        const cityByName = this.cities.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (cityByName) return cityByName;

        for (const city of this.cities) {
            const cityCoords = city.lat && city.lon ? { lat: city.lat, lon: city.lon } : null;
            if (cityCoords && checkCoords(cityCoords, coords)) return city;
        }
        return null;
    }

    async loadElements() {
        try {
            this.ui.showLoad();
            this.ui.clearWeatherContainer();

            if (this.currentLocation) {
                try {
                    await this.showCurrentLocationWeather();
                } catch (error) {
                    throw new Error(error);
                }
            }

            for (const c of this.cities) {
                try {
                    await this.cityWeather(c.name);
                    await waitGap(300);
                } catch (error) {
                    throw new Error(error);
                }
            }
        } catch (error) {
            throw new Error(error);
        } finally {
            this.ui.hideLoad();
        }
    }

    async updateState() {
        try {
            this.ui.showLoad();
            this.ui.clearWeatherContainer();
            await waitGap(100);

            if (this.currentLocation) {
                try {
                    await this.showCurrentLocationWeather();
                    await waitGap(800);
                } catch (error) {
                    throw new Error(error);
                }
            }

            for (const c of this.cities) {
                try {
                    await this.cityWeather(c.name);
                    await waitGap(800);
                } catch (error) {
                    throw new Error(error);
                }
            }
        } catch (error) {
            throw new Error(error);
        } finally {
            this.ui.hideLoad();
        }
    }
}
