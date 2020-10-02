import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://tasty-burger-953f1.firebaseio.com/'
});

export default instance;
