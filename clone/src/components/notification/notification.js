import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { clearAlert } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";

const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Error = props => {
    const dispatch = useDispatch();

    const error = useSelector(state => state.error);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(clearAlert());
    };

    return (
        <React.Fragment>
            {(error.errorCode != '' || error.errorMessage != '') &&
                <Snackbar
                    autoHideDuration={5000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={(error.errorCode != '' || error.errorMessage != '')}
                    onClose={handleClose}
                    message={error.errorCode}
                    key={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleClose} severity={error.errorType === undefined ? 'error' : error.errorType}>
                        {error.errorCode} {error.errorMessage !== "" ? ':' : ''} {error.errorMessage}
                    </Alert>
                </Snackbar>
            }
        </React.Fragment>

    );
}

export default Error;