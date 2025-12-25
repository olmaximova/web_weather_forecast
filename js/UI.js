import { FormCreator } from './formCreator.js';

export class UIManager {
    constructor() {
        this.makeForms();
        this.getEls();
        this.bindAct();
    }

    makeForms() {
        const city = FormCreator.makeCityForm();
        this.cityForm = city.form;
        this.cityInp = city.inp;
        this.citySugg = city.sugg;
        this.cityErr = city.err;
        this.submitCity = city.submitBtn;
        this.cancelCity = city.cancelBtn;
        this.cityClose = city.closeBtn;

        const loc = FormCreator.makeLocForm();
        this.locForm = loc.form;
        this.locInp = loc.inp;
        this.locSugg = loc.sugg;
        this.locErr = loc.err;
        this.submitLoc = loc.submitBtn;
        this.retryLoc = loc.retryBtn;
        this.locClose = loc.closeBtn;

        document.querySelector('.main-content').append(this.cityForm, this.locForm);
    }

    getEls() {
        this.container = document.getElementById('weather-container');
        this.loading = document.getElementById('loading-state');
        this.errorBox = document.getElementById('error-state');
        this.errorText = document.getElementById('error-message');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.addBtn = document.getElementById('add-city-btn');
        this.changeLocBtn = document.getElementById('change-location-btn');
        this.retryBtn = document.getElementById('retry-btn');
    }

    bindAct() {
        this.cityClose.onclick = () => this.hideCity();
        this.locClose.onclick = () => this.hideLocationForm();
        this.cancelCity.onclick = () => this.hideCity();
    }

    showLoad() {
        this.loading.classList.remove('hidden');
        this.errorBox.classList.add('hidden');
    }

    hideLoad() {
        this.loading.classList.add('hidden');
    }

    errorMsg(msg, type) {
        if (type === 'city') this.cityErr.textContent = msg;
        else if (type === 'loc') this.locErr.textContent = msg;
        else {
            this.errorText.textContent = msg;
            this.errorBox.classList.remove('hidden');
        }
    }

    hideErr() {
        this.errorBox.classList.add('hidden');
    }

    clearErr(type) {
        if (type === 'city') this.cityErr.textContent = '';
        else if (type === 'loc') this.locErr.textContent = '';
    }

    showCity() {
        this.cityForm.classList.remove('hidden');
        this.cityInp.focus();
    }

    hideCity() {
        this.cityForm.classList.add('hidden');
        this.cityInp.value = '';
        this.hideSuggestions();
        this.clearErr('city');
    }

    showLocationForm() {
        this.locForm.classList.remove('hidden');
        this.locInp.focus();
    }

    hideLocationForm() {
        this.locForm.classList.add('hidden');
        this.locInp.value = '';
        this.hideSuggestions();
        this.clearErr('loc');
    }

    showSuggestions(items, container, callback) {
        this.clearElement(container);

        if (!items || items.length === 0) {
            this.hideSuggestions();
            return;
        }

        items.forEach(name => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = name;
            div.onclick = () => callback(name);
            container.appendChild(div);
        });

        container.classList.remove('hidden');
    }

    hideSuggestions() {
        this.citySugg.classList.add('hidden');
        this.locSugg.classList.add('hidden');
    }

    clearWeatherContainer() {
        this.clearElement(this.container);
    }

    clearElement(el) {
        while (el.firstChild) el.removeChild(el.firstChild);
    }
}