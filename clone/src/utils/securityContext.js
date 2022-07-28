import React from 'react';

export const securityContext = {
    userName: "Pavel Kotau",
    password: "",
    token: "",
    roles: ["Admin", "Developer"],
    isAuthenticated: true
}

export const SecurityContext = React.createContext(securityContext);
export const SecurityProvider = SecurityContext.Provider;
