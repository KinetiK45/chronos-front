import axios from "axios";

const domain = 'http://localhost:3001/api';

const axiosInstance = axios.create({
    baseURL: domain,
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    }
});

export default class Requests {
    // AUTH
    static async registration(username, password, email, full_name){
        let obj = {
            username: username,
            password: password,
            email: email,
            full_name: full_name
        };
        const resp = await
            axiosInstance.post('/auth/register', obj);
        return resp.data;
    }
    static async login(username, password){
        let obj = {username:username, password:password};
        const resp = await
            axiosInstance.post('/auth/login', obj);
        return resp.data;
    }
    static async logout(){
        const resp = await
            axiosInstance.post('/auth/logout');
        return resp.data;
    }
    static async passwordResetCreate(email){
        let obj = {email:email};
        const resp = await
            axiosInstance.post('/auth/password-reset', obj);
        return resp.data;
    }
    static async passwordResetConfirm(confirm_token, password){
        let obj = {
            password: password
        };
        const resp = await
            axiosInstance.post(`/auth/password-reset/${confirm_token}`, obj);
        return resp.data;
    }

    // USER
    static async users_all(page = 1, order = 'ASC', field = 'id'){
        const config = {
            headers: {
                'field': field,
                'order': order,
                'page': page
            }
        };
        console.log(config.headers);
        const resp = await
            axiosInstance.get(`/users/`, config);
        return resp.data;
    }
    static async user_by_id(user_id){
        const resp = await
            axiosInstance.get(`/users/${user_id}`);
        return resp.data;
    }
    static async create_user(login, password, email, role = 'user'){
        let obj = {
            login: login,
            password: password,
            email: email,
            role: role
        };
        const resp = await
            axiosInstance.post(`/users/`, obj);
        return resp.data;
    }
    static async avatarUpload(file, account_id, token){
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'account_id': account_id,
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/users/avatar`, data, config);
        return resp;
    }
    static get_img_link(user_id){
        return `${domain}/users/${user_id}/avatar`;
    }
    static async edit_user(edited_data, user_id, token){
        let obj = {
            data: edited_data,
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/users/${user_id}`, obj, config);
        return resp.data;
    }
    static async delete_user(user_id){
        const resp = await
            axiosInstance.delete(`/users/${user_id}`);
        return resp.data;
    }

    // CALENDAR

    static async allCalendars(token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.get(`/calendar/all`, config);
        return resp.data;
    }

    static async allEvents(token, countryCode, calendar_id, period = 'month'){
        const params = new URLSearchParams();
        params.append('calendar_id', calendar_id);
        params.append('countryCode', countryCode);
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params,
        };

        const resp = await
            axiosInstance.get(`/events/all/${period}`, config);
        return resp.data;
    }

    // UTILS
    // static async getMyLocation(){
    //     const resp = await axiosInstance.get('http://ip-api.com/json');
    //     return resp.data;
    // }
}