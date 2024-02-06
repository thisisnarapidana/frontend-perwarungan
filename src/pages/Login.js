import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import apiUrl from '../apiConfig';

import isAuthenticated from '../authCheck';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await isAuthenticated();
            if (res.success) navigate('/');
        }

        checkAuth();
    }, [navigate]);

    async function log() {
        if (!isCooldown) {
            setIsCooldown(true);

            try {
                const response = await fetch( apiUrl + '/users/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    console.log('Login successful!');
                    localStorage.setItem('session_id', data.session_id);
                    navigate('/');
                    window.location.reload(false);
                } else {
                    console.log('Login failed');
                }
            } catch (error) {
                // console.error('Error during login fetch:', error);
            }

            setTimeout(() => {
                setIsCooldown(false);
            }, 2000);
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <p>login</p>
                <form onSubmit={(e) => { e.preventDefault(); log(); }}>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </header>
        </div>
    );
}

export default Login;
