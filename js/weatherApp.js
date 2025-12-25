import { UIManager } from './UI.js';
import { WeatherCard } from './weatherCard.js';
import { WeatherService } from './weatherService.js';
import { GeolocationService } from './geoLocation.js';
import { CityService } from './cityService.js';

export class WeatherApp {
    constructor() {
        this.cities = JSON.parse(localStorage.getItem('weather_app_cities') || '[]');
        this.location = JSON.parse(localStorage.getItem('weather_app_current_location') || 'null');
        this.ui = new UIManager();
        
        this.start();
    }
    
    start() {
        this.setup();
        this.getWeather();
    }
    
    setup() {
        this.ui.refreshBtn.onclick = () => this.refresh();
        this.ui.retryBtn.onclick = () => this.getWeather();
        
        this.ui.addBtn.onclick = () => this.ui.showCityForm();
        this.ui.cancelCity.onclick = () => this.ui.hideCityForm();
        this.ui.submitCity.onclick = () => this.addCity();
        
        this.ui.submitLoc.onclick = () => this.setLocation();
        this.ui.retryLoc.onclick = () => this.getLocation();
        
        this.ui.cityInp.oninput = (e) => this.showSuggestions(e.target.value, 'city');
        this.ui.locInp.oninput = (e) => this.showSuggestions(e.target.value, 'loc');
        
        document.onclick = (e) => {
            if (!e.target.closest('.city-input')) {
                this.ui.hideSuggestions();
            }
        };
    }
    
    async getWeather() {
        try {
            this.ui.showLoading();
            this.ui.clearWeatherContainer();
            
            if (this.location) {
                await this.loadWeatherByCoords(this.location.lat, this.location.lon, 'Текущее местоположенее', true);
            } else if (GeolocationService.isSupported()) {
                await this.getLocation();
            } else {
                this.ui.showLocationForm();
            }
            
            for (const city of this.cities) {
                await this.loadCityWeather(city.name);
                await this.delay(300);
            }
            
        } catch {
            this.ui.showLocationForm();
        } finally {
            this.ui.hideLoading();
        }
    }
    
    delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
    
    async getLocation() {
        try {
            this.ui.showLoading();
            
            const data = await WeatherService.getGeoWeather(GeolocationService); 
            
            this.location = data.coords;
            localStorage.setItem('weather_app_current_location', JSON.stringify(data.coords));
            
            this.createWeatherCard(data.weather, data.locationName, true);
            this.ui.hideLocationForm();
            
        } catch {
            this.ui.showLocationForm();
        } finally {
            this.ui.hideLoading();
        }
    }
    
    async loadWeatherByCoords(lat, lon, name, isCurrent) {
        try {
            const weather = await WeatherService.getWeather(lat, lon);
            this.createWeatherCard(weather, name, isCurrent);
        } catch {
            throw new Error('Ошибка при загрузке');
        }
    }
    
    async loadCityWeather(name) {
        try {
            const res = await WeatherService.getWeatherForCity(name, CityService);
            this.createWeatherCard(res.weather, res.locationName, false);
        } catch {
            this.ui.showError(`Ошибка для ${name}`);
        }
    }
    
    createWeatherCard(data, name, isCurrent) {
        const card = new WeatherCard(data, name, isCurrent);
        this.ui.container.appendChild(card.getElement());
        
        if (!isCurrent) {
            card.setRemoveCallback(() => {
                this.removeCity(name);
                card.getElement().remove();
            });
        }
    }
    
    async addCity() {
        const name = this.ui.cityInp.value.trim();
        
        if (!name) {
            this.ui.showError('Введите город', 'city');
            return;
        }
        
        try {
            const check = await CityService.validateCity(name);
            
            if (!check.valid) {
                this.ui.showError(check.message, 'city');
                return;
            }
            
            if (this.cities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                this.ui.showError('Такой город уже есть', 'city');
                return;
            }
            
            this.ui.showLoading();
            this.cities.push({ name });
            localStorage.setItem('weather_app_cities', JSON.stringify(this.cities));
            
            await this.loadCityWeather(name);
            
            this.ui.cityInp.value = '';
            this.ui.hideCityForm();
            
        } catch {
            this.ui.showError('Не удалось добавить', 'city');
        } finally {
            this.ui.hideLoading();
        }
    }
    
    async setLocation() {
        const name = this.ui.locInp.value.trim();
        
        if (!name) {
            this.ui.showError('Введите город', 'loc'); 
            return;
        }
        
        try {
            const check = await CityService.validateCity(name);
            
            if (!check.valid) {
                this.ui.showError(check.message, 'loc'); 
                return;
            }
            
            this.ui.showLoading();
            const res = await WeatherService.getCityWeather(name, CityService);
            
            this.location = res.coords;
            localStorage.setItem('weather_app_current_location', JSON.stringify(res.coords));
            
            this.ui.clearWeatherContainer();
            this.createWeatherCard(res.weather, res.locationName, true);
            this.ui.hideLocationForm();
            
        } catch (e) {
            this.ui.showError(e.message, 'loc'); 
        } finally {
            this.ui.hideLoading();
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
    
    removeCity(name) {
        this.cities = this.cities.filter(c => c.name !== name);
        localStorage.setItem('weather_app_cities', JSON.stringify(this.cities));
    }
    
    async refresh() {
        try {
            this.ui.showLoading();
            this.ui.clearWeatherContainer();
            
            await this.delay(100);
            
            if (this.location) {
                await this.loadWeatherByCoords(this.location.lat, this.location.lon, 'Текущее местоположенее', true);
                await this.delay(800);
            }
            
            for (const city of this.cities) {
                await this.loadCityWeather(city.name);
                await this.delay(800);
            }
            
        } catch {
            this.ui.showError('Не удалось обновитт');
        } finally {
            this.ui.hideLoading();
        }
    }
    
    retryLoading() {
        this.ui.hideError();
        this.getWeather();
    }
}