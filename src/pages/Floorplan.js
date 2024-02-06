import React, { useState, useEffect } from 'react';
import apiUrl from '../apiConfig';
import Table from '../components/Table';
import './styling/Floorplan.css';

const Floorplan = ({ rolee }) => {
    const role = rolee || '';
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableNo, setTableNo] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [draggedTableId, setDraggedTableId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl + '/table/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('session_id')
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (table_no) => {
        try {
            const randomX = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
            const randomY = Math.floor(Math.random() * (50 - 10 + 1)) + 10;

            await fetch(apiUrl + '/table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('session_id')
                },
                body: JSON.stringify({
                    no_table: table_no,
                    xpos: randomX.toString(),
                    ypos: randomY.toString()
                }),
            });

            fetchData();
        } catch (error) {
            console.error('Error updating table data:', error);
        }
    };

    const handleSave = async (table_id, position) => {
        try {
            await fetch(apiUrl + '/table/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('session_id')
                },
                body: JSON.stringify({
                    table_id,
                    xpos: position.x,
                    ypos: position.y,
                }),
            });
        } catch (error) {
            console.error('Error updating table data:', error);
        }
    };

    const handleDelete = async (table_id) => {
        try {
            setTables((prevTables) => prevTables.filter((table) => table.table_id !== table_id));

            await fetch(apiUrl + '/table/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('session_id'),
                },
                body: JSON.stringify({
                    table_id: table_id
                })
            });
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    const onDrag = async (isDragging, table_id) => {
        setDraggedTableId(isDragging ? table_id : null);

        const bodyElement = document.body;
        if (isDragging) bodyElement.classList.add('overscroll-contain');
        else bodyElement.classList.remove('overscroll-contain');
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setTableNo(value);
        setIsButtonDisabled(!value);
    };

    const handleAddTable = () => {
        if (tableNo) {
            handleCreate(tableNo);
            setTableNo('');
            setIsButtonDisabled(true);
        }
    };

    return (
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <div className="kontener">
                {role === 'admin' &&
                    <div className="add-table-container">
                        <input
                            type="text"
                            placeholder="Enter Table Number"
                            value={tableNo}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleAddTable} disabled={isButtonDisabled}>
                            +
                        </button>
                    </div>
                }

                {loading ? (
                    <div className="centered-text">Loading...</div>
                ) : (
                    <>
                        {tables.length > 0 ? (
                            <div style={{ width: '100%' }}>
                                {tables.map((table) => (
                                    <Table
                                        key={table.table_id}
                                        enabled={role === 'admin'}
                                        xpos={table.xpos}
                                        ypos={table.ypos}
                                        no_table={table.no_table}
                                        onSave={(position) => handleSave(table.table_id, position)}
                                        onDrag={(isDragging) => onDrag(isDragging, table.table_id)}
                                        handleDelete={() => handleDelete(table.table_id)}
                                        link={`${window.location.hostname}/scan/${table.table_id}`}
                                        isBeingDragged={draggedTableId === table.table_id} // Pass the table id that is being dragged
                                    />
                                ))}
                            </div>
                        ) : (
                            <h1 className="centered-text">Tidak ada meja</h1>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Floorplan;