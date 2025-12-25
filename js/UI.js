export class UIManager {
    constructor() {
        this.getEls();
    }

    getEls() {
        this.container = document.getElementById('weather-container');
        this.cityForm = document.getElementById('city-form-container');
        this.locForm = document.getElementById('location-form-container');
        this.loading = document.getElementById('loading-state');
        this.errorBox = document.getElementById('error-state');
        this.errorText = document.getElementById('error-message');

        this.cityInp = document.getElementById('city-input');
        this.citySugg = document.getElementById('suggestions');
        this.cityErr = document.getElementById('city-error');
        this.submitCity = document.getElementById('submit-city-btn');
        this.cancelCity = document.getElementById('cancel-city-btn');
        this.addBtn = document.getElementById('add-city-btn');

        this.locInp = document.getElementById('location-city-input');
        this.locSugg = document.getElementById('location-suggestions');
        this.locErr = document.getElementById('location-error');
        this.submitLoc = document.getElementById('submit-location-btn');
        this.retryLoc = document.getElementById('retry-geolocation-btn');

        this.refreshBtn = document.getElementById('refresh-btn');
        this.retryBtn = document.getElementById('retry-btn');
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.errorBox.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(msg, type) {
        if (type === 'city') {
            this.cityErr.textContent = msg;
        } else if (type === 'loc') {
            this.locErr.textContent = msg;
        } else {
            this.errorText.textContent = msg;
            this.errorBox.classList.remove('hidden');
        }
    }

    hideError() {
        this.errorBox.classList.add('hidden');
    }

    clearError(type) {
        if (type === 'city') {
            this.cityErr.textContent = '';
        } else if (type === 'loc') {
            this.locErr.textContent = '';
        }
    }

    showCityForm() {
        this.cityForm.classList.remove('hidden');
        this.cityInp.focus();
    }

    hideCityForm() {
        this.cityForm.classList.add('hidden');
        this.cityInp.value = '';
        this.hideSuggestions();
        this.clearError('city');
    }

    showLocationForm() {
        this.locForm.classList.remove('hidden');
        this.locInp.focus();
    }

    hideLocationForm() {
        this.locForm.classList.add('hidden');
        this.locInp.value = '';
        this.hideSuggestions();
        this.clearError('loc');
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
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
}