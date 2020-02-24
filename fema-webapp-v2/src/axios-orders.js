import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://fema-damage-report.firebaseio.com/'
})


export default instance;