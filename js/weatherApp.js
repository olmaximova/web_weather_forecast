import { UIManager } from './UI.js';
import { WeatherLogic } from './weatherLogic.js';
import { WeatherHandlers } from './weatherHandlers.js';
import { storage } from './utils.js';
import { CityService } from './cityService.js';
import { GeolocationService } from './geoLocation.js';

export class WeatherApp {
    constructor() {
        this.cities = storage.get('cities', []);
        this.currentLocation = storage.get('currentLocation', null);
        
        this.ui = new UIManager();
        this.logic = new WeatherLogic(this.cities, this.currentLocation, this.ui.container, this.ui);
        this.handlers = new WeatherHandlers(this.logic, this.ui);
        this.init();
    }

    init() {
        this.bindActions();
        this.loadInitialData();
    }

    async loadInitialData() {
        try {
            await this.logic.loadElements(); 
        } catch (error) {
            console.error('Load error:', error);
            if (!this.currentLocation && !GeolocationService.isSupported()) {
                this.ui.showLocationForm();
            }
        }
    }

    bindActions() {
        const actions = {
            refreshBtn: () => this.refreshData(),
            retryBtn: () => this.retryLoad(),
            addBtn: () => this.ui.showCity(),
            cancelCity: () => this.ui.hideCity(),
            submitCity: () => this.handlers.addCity(),
            submitLoc: () => this.handlers.setCurrentLocation(),
            retryLoc: () => this.handlers.getCurrentLocation(),
            changeLocBtn: () => this.handlers.changeCurrentLocation()
        };
        
        Object.entries(actions).forEach(([key, fn]) => {
            if (this.ui[key]) this.ui[key].onclick = fn;
        });

        if (this.ui.cityInp) this.ui.cityInp.oninput = (e) => this.showSuggestions(e.target.value, 'city');
        if (this.ui.locInp) this.ui.locInp.oninput = (e) => this.showSuggestions(e.target.value, 'loc');

        document.onclick = (e) => {
            if (!e.target.closest('.city-inp')) this.ui.hideSuggestions();
        };
    }

    async refreshData() {
        await this.logic.updateState();
    }

    async retryLoad() {
        await this.logic.loadElements(); 
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
        } catch (error) {
            console.error('Suggestions error:', error);
            this.ui.hideSuggestions();
        }
    }
}
