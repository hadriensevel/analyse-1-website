import axios from 'axios';
import {baseUrl} from './config';

async function fetchAuthDetails() {
    try {
        const response = await axios.get(`${baseUrl}/auth/details`, {
            headers: {
                Accept: 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status !== 401) {
            return null;
        }
    }
}

export {fetchAuthDetails};