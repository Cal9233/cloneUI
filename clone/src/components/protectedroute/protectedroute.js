import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from "react-redux";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const user = useSelector(state => state.user);   
    
    return (
        <Route {...rest} render={
            props => {
                if (user && user.active === true) {
                    return <Component {...rest} {...props} />
                } else {
                    return  <Redirect to="/login" />                    
                }
            }
        } />
    )
}

export default ProtectedRoute;