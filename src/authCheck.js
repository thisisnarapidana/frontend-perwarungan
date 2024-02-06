import apiUrl from './apiConfig';
const isAuthenticated = async () => {
    try {
        const response = await fetch( apiUrl + '/users/signcheck', {
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

export default isAuthenticated;