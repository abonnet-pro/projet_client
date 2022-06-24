import {contextPrototype} from "./usersContext.service";

export const admin = () => {
    return contextPrototype.user.role === 'ADMIN'
}

export const superadmin = () => {
    return contextPrototype.user.role === 'SUPERADMIN'
}
