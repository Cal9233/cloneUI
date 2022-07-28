import React, { useEffect, useState, createContext, useContext } from 'react';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

const authContext = createContext({});

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();    
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [authState, setAuthState] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {           
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []
    );
    
    return {
        user,
        authState,        
    };
}