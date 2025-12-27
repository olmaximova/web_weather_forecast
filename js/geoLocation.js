export class GeolocationService {
    static async getCurrentCoords() {
        if (!navigator.geolocation) {
            throw new Error('Геолокация не поддерживается');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => reject(new Error('Не удалось получить местоположение'))
            );
        });
    }

    static isSupported() {
        return !!navigator.geolocation;
    }
}
