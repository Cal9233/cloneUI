import { create } from 'axios';
import config from '../../utils/config';

const API = {};
const instance = create({
    baseURL: config.API_URL_AUTH_DEV,
    withCredentials: true,    
    headers: new Headers({        
        'Content-Type': 'application/json',        
    })
});

API.logIn = (body) => {
    return instance.post('/api/signin', body);    
} 

API.logOut = () => {
    return instance.get('/api/logout');
} 

API.isAuthenticated = () => {
    return instance.get('/api/auth');
} 

API.forgot = (body) => {
    return instance.post('/api/forgot', body);    
}

API.resetUserPassword  = (userId) => {
    return instance.get(`/api/resetpassword/${userId}`);
}

export default API;