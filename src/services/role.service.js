import {contextPrototype} from "./usersContext.service";

export const admin = () => {
    return contextPrototype.user.role === 'ADMIN'
}
