import React, { useState, useEffect } from "react";
import TrackDetails from "./TrackDetailsComponent";
import "./styling/SpotifyPlayerComponent.css";
import apiUrl from "../apiConfig";
import "../tombol.css";

function SpotifyPlayerComponent({ rolee, socket }) {
  const role = rolee || "";
  const [spotifyLoggedCode, setSpotifyLoggedCode] = useState(200); //200 = success, 401 = token not valid, 403 = spotify isn't premium
  const [trackName, setTrackName] = useState("");
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState([]);

  useEffect(() => {
    if (role === "clerk") checkBackendToken();
  }, [role]);

  useEffect(() => {
    const handleRestrack = ({ tracks }) => {
      setTracks(tracks);
    };

    const handleCurrent = (currentTrack) => {
      let temptrack = [];
      temptrack.push(currentTrack);
      console.log(currentTrack);
      if (typeof temptrack[0].name !== "undefined") setCurrentTrack(temptrack);
      else setCurrentTrack([]);
    };

    if (socket) {
      socket.on("restrack", handleRestrack);
      socket.on("current", handleCurrent);
    }

    return () => {
      if (socket) {
        socket.off("restrack", handleRestrack);
        socket.off("current", handleCurrent);
      }
    };
  }, [socket]);

  const checkBackendToken = async () => {
    console.log("check");

    try {
      const response = await fetch(apiUrl + "/spotify/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("session_id"),
        },
      });
      // console.log(response.status);
      setSpotifyLoggedCode(response.status);
    } catch (error) {
      // console.error("Error checking token:", error);
    }
  };

  useEffect(() => {
    if (trackName.trim() !== "") {
      console.log(trackName);
      socket.emit("reqtrack", { searchTerm: trackName });
    }
  }, [trackName, socket]);

  const handleSearch = (e) => {
    setTrackName(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(apiUrl + "/spotify/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("session_id"),
        },
      });
      const resData = await response.json();

      window.location = resData.redirectUrl; //redirect to spotify
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    try {
      fetch(apiUrl + "/spotify/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("session_id"),
        },
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const reqTrackHandle = (trackId) => {
    socket.emit("addtrack", trackId);
  };

  return (
    <div>
      <div>
        <div className="canvas-container">
          <div className="input-bar">
            <svg
              className="find-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#FFFFFF"
                d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"
              ></path>
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
            {trackName !== "" &&
              tracks.length > 0 &&
              tracks.map((track, index) => (
                <TrackDetails
                  key={index}
                  draggable={true}
                  name={track.name}
                  image={track.album.images[2].url}
                  artist={track.artists[0].name}
                  duration={track.duration_ms}
                  reqTrackHandle={() => reqTrackHandle(track.id)}
                />
              ))}

            {currentTrack.length > 0 ? (
              <h4>Sedang diputar</h4>
            ) : (
              <h4>Menunggu permusikan</h4>
            )}

            {currentTrack.map((track, index) => (
              <div key={index}>
                <TrackDetails
                  draggable={false}
                  name={track.name}
                  image={track.album.images[2].url}
                  artist={track.artists[0].name}
                  duration={track.duration_ms}
                />
              </div>
            ))}
            {role === "clerk" && (
              <>
                {spotifyLoggedCode > 200 ? (
                  <>
                    {spotifyLoggedCode === 401 && (
                      <button className="tombol" onClick={handleLogin}>
                        Masuk Spotify sebagai pemutar
                      </button>
                    )}
                    {spotifyLoggedCode === 403 && (
                      <div>
                        <button className="tombol" onClick={handleLogout}>
                          Keluar dan perpanjang langganan Spotify
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button className="tombol" onClick={handleLogout}>
                    Keluar Spotify
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotifyPlayerComponent;
