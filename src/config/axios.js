import axios from "axios";


const api = axios.create({
    baseURL: 'http://14.225.207.169:8082/api/'
  });


export default api;