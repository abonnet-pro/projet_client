export const USER_KEY = 'user'

export function setLocaleStorage(key, value) {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
}

export function getLocalStorage(key) {
    const stringValue = localStorage.getItem(key);
    return JSON.parse(stringValue);
}
