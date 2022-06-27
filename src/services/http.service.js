import {USER_KEY} from "./localStorage.service";

function token () {
    return JSON.parse(localStorage.getItem(USER_KEY))?.token
}

export const headerToken = {
    headers: { 'Authorization' : 'bearer ' + token() }
}
