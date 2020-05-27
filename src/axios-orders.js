import axios from 'axios';

const instance = axios.create ({
    baseURL: 'https://burger-app-de130.firebaseio.com/'
});

export default instance;