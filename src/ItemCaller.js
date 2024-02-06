import { useEffect } from 'react';
import apiUrl from './apiConfig';

export const GetAll = ({ setItems, setLoading }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl + '/item/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('session_id')
                    },
                });
                const data = await response.json();
                setItems(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching catalog data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [setItems, setLoading]);

    return null;
};

export const Get = ({ setItems, setLoading }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl + '/item/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('session_id')
                    },
                });
                const data = await response.json();
                setItems(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching catalog data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [setItems, setLoading]);

    return null;
};