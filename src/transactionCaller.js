import { useEffect } from 'react';
import apiUrl from './apiConfig';

export const Checkout = async (table_id) => {
    try {
        const cardItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const formattedItems = cardItems.map(item => [item.item_id, item.qty]);

        const response = await fetch(apiUrl + '/checkout/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('session_id')
            },
            body: JSON.stringify({
                table_id: table_id,
                items: formattedItems
            })
        });

        if (!response.ok) {
            console.error('Checkout failed. Status:', response.status);
            return { success: false, message: 'Checkout failed. Please try again.' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error during checkout:', error);
        return { success: false, message: 'An error occurred during checkout. Please try again.' };
    }
};


export const Kulakan = ({ setItems, setLoading }) => {
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