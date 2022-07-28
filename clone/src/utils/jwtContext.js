import React from 'react';

export const jwtContext = {    
    api_token: "eyJraWQiOiJHUkRFY2x6XC9hT2xnM2VZSjZmK001dmhCQ3h3OU1hNGF0Yks0SWZTemtQdz0iLCJhbGciOiJSUzI1NiJ9",    
}

export const JwtContext = React.createContext(jwtContext);
export const JwtProvider = JwtContext.Provider;
