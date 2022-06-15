import {JWT_KEY} from "./localStorage.service";

export const token = () => {
    let token = localStorage.getItem(JWT_KEY)
    if(token) {
        return token.substring(0, token.length - 1).replace("\"", '');
    }
    return '';
}

export const headerToken = {
    headers: { 'Authorization' : 'bearer ' + token() }
}