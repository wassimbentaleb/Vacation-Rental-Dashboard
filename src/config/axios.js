import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_ENDPOINT
})

instance.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
}, error => {
    console.log(error)
    return Promise.reject(error)
})


instance.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status == 401) {
        localStorage.setItem('token', null)
        localStorage.setItem('connected', false)
        window.location.reload()
    }
    return Promise.reject(error)
})

export default instance