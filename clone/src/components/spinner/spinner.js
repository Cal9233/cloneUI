import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const Spinner = props => {
    return <LinearProgress size={40} color="primary" style={{width: '100%'}}/>
};

export default Spinner;
