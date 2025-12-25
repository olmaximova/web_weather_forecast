import { UIManager } from './UI.js';
import { WeatherCard } from './weatherCard.js';
import { WeatherService } from './weatherService.js';
import { GeolocationService } from './geoLocation.js';
import { CityService } from './cityService.js';

export class WeatherApp {
    constructor() {

        this.cities = JSON.parse(localStorage.getItem('cities') || '[]');
        this.loc = JSON.parse(localStorage.getItem('location') || 'null');
        this.ui = new UIManager();

        this.init();
    }

    init() {
        this.bindActions();
        this.loadElements();
    }

    bindActions() {
        this.ui.refreshBtn.onclick = () => this.update();
        this.ui.retryBtn.onclick = () => this.loadElements();
        this.ui.addBtn.onclick = () => this.ui.showCity();
        this.ui.cancelCity.onclick = () => this.ui.hideCity();
        this.ui.submitCity.onclick = () => this.addCity();
        this.ui.submitLoc.onclick = () => this.setLoc();
        this.ui.retryLoc.onclick = () => this.getLoc();
        this.ui.changeLocBtn.onclick = () => this.changeLoc();

        this.ui.cityInp.oninput = (e) => this.showSuggestions(e.target.value, 'city');
        this.ui.locInp.oninput = (e) => this.showSuggestions(e.target.value, 'loc');

        document.onclick = (e) => {
            if (!e.target.closest('.city-inp')) this.ui.hideSuggestions();
        };
    }

    async loadElements() {
        try {
            this.ui.showLoad();
            this.ui.clearWeatherContainer();

            if (this.loc) {
                await this.byCoords(this.loc.lat, this.loc.lon, 'Текущее местоположение', true);
            } else if (GeolocationService.isSupported()) {
                await this.getLoc();
            } else {
                this.ui.showLocationForm();
            }

            for (const c of this.cities) {
                await this.cityWeather(c.name);
                await this.waitGap(300);
            }

        } catch (error) {
            this.ui.showLocationForm();
        } finally {
            this.ui.hideLoad();
        }
    }
    

    waitGap(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async getLoc() {
        try {
            this.ui.showLoad();

            const data = await WeatherService.getGeoWeather(GeolocationService);

            this.loc = data.coords;

            localStorage.setItem('location', JSON.stringify(data.coords));

            this.makeCard(data.weather, data.locationName, true);

            this.ui.hideLocationForm();

        } catch (error) {
            this.ui.showLocationForm();
        } finally {
            this.ui.hideLoad();
        }
    }

    async byCoords(lat, lon, name, isCurr) {
        try {
            const w = await WeatherService.getWeather(lat, lon);
            this.makeCard(w, name, isCurr);
        } catch (error) {
            throw new Error('Ошибка получения данных по координатам');
        }
    }

    async cityWeather(name) {
        try {
            const res = await WeatherService.getWeatherForCity(name, CityService);
            this.makeCard(res.weather, res.locationName, false);
        } catch (error) {
            this.ui.errorMsg(`Ошибка: ${name}`);
        }
    }

    makeCard(data, name, isCurr) {
        const card = new WeatherCard(data, name, isCurr);
        this.ui.container.appendChild(card.getElement());

        if (!isCurr) {
            card.setRemoveCallback(() => {
                this.delCity(name);
                card.getElement().remove();
            });
        }
    }

    async addCity() {
        const name = this.ui.cityInp.value.trim();
        if (!name) return this.ui.errorMsg('Введите город', 'city');

        try {
            const validation = await CityService.validateCity(name);
            if (!validation.valid) return this.ui.errorMsg(validation.message, 'city');

            if (this.cities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                return this.ui.errorMsg('Город уже добавлен', 'city');
            }

            this.ui.showLoad();
            this.cities.push({ name });
            localStorage.setItem('cities', JSON.stringify(this.cities));

            await this.cityWeather(name);
            this.ui.cityInp.value = '';
            this.ui.hideCity();

        } catch (error) {
            this.ui.errorMsg('Не удалось добавить город', 'city');
        } finally {
            this.ui.hideLoad();
        }
    }

    async setLoc() {
        const name = this.ui.locInp.value.trim();
        if (!name) return this.ui.errorMsg('Введите город', 'loc');

        try {
            const validation = await CityService.validateCity(name);
            if (!validation.valid) return this.ui.errorMsg(validation.message, 'loc');

            this.ui.showLoad();
            const res = await WeatherService.getWeatherForCity(name, CityService);

            this.loc = res.coords;
            localStorage.setItem('location', JSON.stringify(res.coords));

            this.ui.clearWeatherContainer();
            this.makeCard(res.weather, res.locationName, true);
            this.ui.hideLocationForm();

        } catch (error) {
            this.ui.errorMsg(error.message, 'loc');
        } finally {
            this.ui.hideLoad();
        }
    }

    async showSuggestions(text, type) {
        if (text.length < 2) {
            this.ui.hideSuggestions();
            return;
        }

        try {
            const items = await CityService.getSuggestions(text);
            const container = type === 'city' ? this.ui.citySugg : this.ui.locSugg;
            const input = type === 'city' ? this.ui.cityInp : this.ui.locInp;

            this.ui.showSuggestions(items, container, (city) => {
                input.value = city;
                this.ui.hideSuggestions();
            });
        } catch {
            this.ui.hideSuggestions();
        }
    }

    delCity(name) {
        this.cities = this.cities.filter(c => c.name !== name);
        localStorage.setItem('cities', JSON.stringify(this.cities));
    }

    async update() {
        try {
            this.ui.showLoad();
            this.ui.clearWeatherContainer();

            await this.waitGap(100);

            if (this.loc) {
                await this.byCoords(this.loc.lat, this.loc.lon, 'Текущее местоположенее', true)
                await this.waitGap(800);
            }

            for (const c of this.cities) {
                await this.cityWeather(c.name);
                await this.waitGap(800);
            }

        } catch (error) {
            console.log(error)
            this.ui.errorMsg('Не удалось обновитт');
        } finally {
            this.ui.hideLoad();
        }
    }

    changeLoc() {
        this.loc = null;
        localStorage.removeItem('location');
        this.ui.showLocationForm();
    }
}