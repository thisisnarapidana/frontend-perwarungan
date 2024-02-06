import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const Table = ({ enabled, xpos, ypos, no_table, onSave, onDrag, isBeingDragged, handleDelete, link }) => {
    const [position, setPosition] = useState({ x: Math.min(window.innerWidth - 50, xpos), y: Math.min(window.innerHeight - 50, ypos) });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e) => {
        if (!enabled) return;

        setStartPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
        onDrag(true);
        setIsDragging(true);
    };

    const handleTouchStart = (e) => {
        if (!enabled) return;

        const touch = e.touches[0];
        setStartPosition({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        });
        onDrag(true);
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!enabled) return;

        if (!isDragging) return;

        let newPosition = {
            x: e.clientX - startPosition.x,
            y: e.clientY - startPosition.y,
        };

        newPosition.x = Math.min(window.innerWidth - 50, Math.max(0, newPosition.x));
        newPosition.y = Math.min(window.innerHeight - 50, Math.max(0, newPosition.y));

        setPosition(newPosition);
    };

    const handleTouchMove = (e) => {
        if (!enabled) return;

        if (!isBeingDragged || e.touches.length !== 1) return;

        const touch = e.touches[0];

        let newPosition = {
            x: touch.clientX - startPosition.x,
            y: touch.clientY - startPosition.y,
        };

        newPosition.x = Math.min(window.innerWidth - 50, Math.max(0, newPosition.x));
        newPosition.y = Math.min(window.innerHeight - 50, Math.max(0, newPosition.y));

        setPosition(newPosition);
    };

    const handleMouseUp = () => {
        if (!enabled) return;

        onSave(position);
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        if (!enabled) return;

        onSave(position);
        setIsDragging(false);
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                userSelect: 'none',
                cursor: isBeingDragged ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
        >
            <div
                style={{
                    visibility: isBeingDragged ? 'visible' : 'hidden',
                    width: '200px',
                    height: '260px',
                    left: '-70px',
                    background: 'grey',
                    bottom: '80px',
                    position: 'absolute',
                    zIndex: '1000'
                }}
            >
                <h1 style={{ position: 'absolute', top: '10px', color: 'white', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <QRCode value={link} size={100} />
                    <h5>{link}</h5>
                    <button onClick={handleDelete}>hapus</button>
                </h1>
            </div>

            <div
                style={{
                    width: '50px',
                    height: '50px',
                    background: 'grey',
                    position: 'relative',
                    zIndex: '999'
                }}
            >
                <h1 style={{ color: 'white', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    {no_table}
                </h1>
            </div>

        </div>
    );
};

export default Table;
