import React from 'react';
import Navigation from '../navigation/navigation';
import { useAuth } from "../../utils/authContext";
import './authapp.css';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../actions/index";
import Redirect from '../auth/redirect';
import Forgot from '../auth/forgot';
import { Switch, Route } from "react-router-dom";
import ProtectedRoute from '../protectedroute/protectedroute';
import awsconfig from '../../aws-exports';

const AuthApp = () => {
    const dispatch = useDispatch(); 

    const user = useSelector(state => state.user);
    dispatch(setUser(user));

    return (
        <Switch>
            <ProtectedRoute exact path={["/"]} component={Navigation}  />           
            <Route exact path="/login" component={() => <Redirect />} />
            <Route exact path="/forgot" component={() => <Forgot />} />
        </Switch>
    );

    /*return user ? (
        <div className="App">
            <Navigation username={user.username} />
        </div>
    ) : (
            <AmplifyAuthenticator style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <AmplifySignIn slot="sign-in" usernameAlias="email" hideSignUp />
            </AmplifyAuthenticator>
        );*/
}

export default AuthApp;