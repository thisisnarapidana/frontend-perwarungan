import { useEffect } from 'react';
import apiUrl from './apiConfig';

export const isAuthenticated = async () => {
    try {
        const response = await fetch(apiUrl + '/users/signcheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('session_id')
            },
        });

        return await response.json();
    } catch (error) {
        return false;
    }
};

export const firstScan = async () => {
    try {
        const response = await fetch(apiUrl + '/users/firstscan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        localStorage.setItem('session_id', data.session_id);
    } catch (error) {

    }
};

export const update = async () => {
    try {
        const response = await fetch(apiUrl + '/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        return false;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(apiUrl + '/users/signout', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('session_id')
            },
        });

        return await response.json();
    } catch (error) {
        return false;
    }
};