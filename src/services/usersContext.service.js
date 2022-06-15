import React from "react"

export const contextPrototype = {
    user: {},
    setUser: () => {},
}

export const UserContext = React.createContext(contextPrototype)
