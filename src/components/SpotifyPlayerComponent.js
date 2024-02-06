import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TrackDetails from "./TrackDetailsComponent";
import "./styling/SpotifyPlayerComponent.css";
import apiUrl from '../apiConfig';

function SpotifyPlayerComponent({ rolee }) {
    const role = rolee || '';
    const [socket, setSocket] = useState(null);
    const [spotifyLogged, setSpotifyLogged] = useState(false);
    const [messages, setMessages] = useState([]);
    const [trackName, setTrackName] = useState('');
    const [tracks, setTracks] = useState([]);
    const [currenttrack, setCurrentTrack] = useState([]);

    useEffect(() => {
        const newSocket = io('http://localhost:1946');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (role === 'clerk') checkBackendToken();
    }, [role]); // Empty dependency array ensures the effect runs only once, similar to componentDidMount
    
    const checkBackendToken = async () => {
        console.log('check');
        
        try {
            const response = await fetch(apiUrl + '/spotify/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('session_id')
                },
            });
    
            if (response.status === 200) {
                setSpotifyLogged(true);
                console.log("Token is valid");
            } else {
                setSpotifyLogged(false);
                console.log("Token is invalid");
            }
        } catch (error) {
            console.error("Error checking token:", error);
        }
    };
    

    useEffect(() => {
        if (!socket) return;

        socket.on('chat message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        socket.on('restrack', ({ tracks }) => {
            setTracks(tracks);
        });

        socket.on('current', (currentTrack) => {
            let temptrack = [];
            temptrack.push(currentTrack);
            console.log(currentTrack);
            if(typeof temptrack[0].name !== 'undefined') setCurrentTrack(temptrack);
        });

        // Clean up event listeners when component unmounts
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        if (trackName.trim() !== '') {
            socket.emit('reqtrack', { searchTerm: trackName });
        }
    }, [trackName, socket]);

    if (!socket) return null;

    const handleSearch = (e) => {
        setTrackName(e.target.value);
    };

    const handleLogin = () => {
        window.location.href = `http://localhost:1946/spotify/login?auth=${localStorage.getItem('session_id')}`;
    };

    const reqTrackHandle = (trackId) => {
        socket.emit('addtrack', trackId);
    };

    return (
        <div>
            <div>
                <div className="canvas-container">
                    <div className="input-bar">
                        <svg className="find-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="#FFFFFF" d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
                        </svg>

                        <input
                            type="text"
                            value={trackName}
                            onChange={handleSearch}
                            placeholder="cari dan vote permusikan"
                            className="search-input"
                        />
                    </div>
                    <div className="items-container">
                        {trackName !== '' && tracks.length > 0
                            && tracks.map((track, index) => (
                                <TrackDetails key={index} draggable={true} name={track.name} image={track.album.images[2].url} artist={track.artists[0].name} duration={track.duration_ms} reqTrackHandle={() => reqTrackHandle(track.id)} />
                            ))
                        }
                        {currenttrack.map((track, index) => (
                                <div>
                                    <h4>now playing</h4>
                                    <TrackDetails key={index} draggable={false} name={track.name} image={track.album.images[2].url} artist={track.artists[0].name} duration={track.duration_ms} />
                                </div>
                            ))
                        }
                        {role === 'clerk' && !spotifyLogged && <button onClick={handleLogin}>login</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpotifyPlayerComponent;
