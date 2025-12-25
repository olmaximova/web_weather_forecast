export const waitGap = (ms) => new Promise(r => setTimeout(r, ms));

export const checkCoords = (c1, c2, tolerance = 0.1) => {
    const latDiff = Math.abs(c1.lat - c2.lat);
    const lonDiff = Math.abs(c1.lon - c2.lon);
    return latDiff < tolerance && lonDiff < tolerance;
};

export const storage = {
    get(key, defaultValue = []) {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    remove(key) { localStorage.removeItem(key); }
};
