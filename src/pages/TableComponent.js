import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiUrl from "../apiConfig";
import SpotifyPlayerComponent from "../components/SpotifyPlayerComponent";
import Catalog from "./Catalog";
import ErrorComponent from "../components/ErrorComponent";

const TableComponent = ({ socket }) => {
  const { table_id } = useParams();
  const [error, setError] = useState(null);
  const [tableNo, setTable] = useState("");

  useEffect(() => {
    const getTable = async () => {
      try {
        const url = `${apiUrl}/table/${table_id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("session_id"),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setTable(data[0].no_table);
      } catch (error) {
        console.error("Error fetching table data:", error.message);
        setError(error.message);
      }
    };

    getTable();
  }, []);

  return (
    <div>
      {!error ? (
        <>
          <SpotifyPlayerComponent socket={socket} />
          <Catalog tableNo={tableNo} />
        </>
      ) : (
        <ErrorComponent message={error} />
      )}
    </div>
  );
};

export default TableComponent;
