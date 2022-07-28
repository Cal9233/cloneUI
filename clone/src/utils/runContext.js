import React from 'react';

export const runContext = {
    runData: [],
    sampleData: [],
}

export const RunContext = React.createContext(runContext);
export const RunProvider = RunContext.Provider;