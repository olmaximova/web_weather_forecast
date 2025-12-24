export class GeolocationService {
    
    static async getCurrentCoords() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Геолокация не поддерживается'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error('Не удалось получить местоположение'));
                }
            );
        });
    }
    
    static isSupported() {
        return 'geolocation' in navigator;
    }
}