import axios from 'axios';

const instance = axios.create({
    validateStatus: function (status)
    {
        return status === 200;
    },
    baseURL: 'https://helloworld-f744ajok7a-uw.a.run.app'
})


export default instance;