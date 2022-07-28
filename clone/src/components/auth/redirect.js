import React from "react";
import AuthAPI from '../auth/api';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setIsAuthenticated, setAlert } from '../actions/index';
import config from '../../utils/config';

const Redirect = props => {
    let history = useHistory();    
    const dispatch = useDispatch();

    const redirect = () => {
        window.location.href = `${process.env.NODE_ENV != undefined ? config.API_URL_AUTH_DEV : config.API_URL_AUTH_PROD}/api/signin`;
    };

    React.useEffect(() => {
        AuthAPI.isAuthenticated().then(response => {
            if (response.status === 200 && response.data != null) {                
                dispatch(setUser(response.data));
                dispatch(setIsAuthenticated(true));
                history.push("/");
            }
            else {                
               redirect();
            }
        }).catch(err => {            
            dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));;
            //redirect();
        });
    }, []);    

    return (
        <React.Fragment>  
               
        </React.Fragment>
    );
};

export default Redirect;