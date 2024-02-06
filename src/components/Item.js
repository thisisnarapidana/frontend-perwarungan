import React, { useEffect, useState } from 'react';
import './styling/Item.css';
import '../tombol.css';

const Item = ({ isDisabled, item, apiUrl, startqty, cancel, listed, onEdit, isAdmin, onItemEdit }) => {
    const [qty, setQty] = useState(startqty);
    const [editableItem, setEditableItem] = useState(null);

    useEffect(() => {
        // set();
        // navigator.geolocation.getCurrentPosition(function(position) {
        //     const latitude = position.coords.latitude;
        //     const longitude = position.coords.longitude;
        //     console.log('Latitude:', latitude);
        //     console.log('Longitude:', longitude);
        //     const accuracy = position.coords.accuracy;

        //     sss(latitude + " " + longitude + " " + accuracy);
        // }, function(error) {
        //     console.error('Error getting geolocation:', error);
        // });
    }, []);

    const cancelHandler = () => {
        setQty(0);
        cancel();
    };

    const decreaseQty = () => {
        if (qty > 0) {
            setQty(qty - 1);
            onEdit(qty - 1);
        }
        if (qty === 1) cancel();
    };

    const increaseQty = () => {
        setQty(qty + 1);
        onEdit(qty + 1);
    };

    const handleEditClick = (field) => {
        if (isAdmin && !isDisabled) {
            setEditableItem(field);
            onItemEdit();
        }
    };


    const handleFieldChange = (event, field) => {
        let name = event.target.name;
        let value = event.target.value;
    };

    return (
        <div className="quadrant-container">
            <div className="top-left">
                <div className={editableItem === 'name' ? 'editable' : 'name'} onClick={() => handleEditClick('name')}>
                    {editableItem === 'name' ? (
                        <input name='name' type="text" className='input' value={item.name} onChange={(e) => handleFieldChange(e, 'name')} />
                    ) : (
                        <h1 style={{ fontSize: '20px' }}>{item.name}</h1>
                    )}
                </div>
                <div className={editableItem === 'price' ? 'editable' : 'price'} onClick={() => handleEditClick('price')}>
                    {editableItem === 'price' ? (
                        <input name='price' type="text" value={item.price} onChange={(e) => handleFieldChange(e, 'price')} />
                    ) : (
                        item.price
                    )}
                </div>
            </div>
            <div className="top-right">
                <img
                    name='image'
                    src={apiUrl + "/" + item.image_url}
                    alt="Product"
                    className={editableItem === 'image' ? 'editable' : 'image'}
                    onClick={() => handleEditClick('image')}
                />
            </div>
            <div className="bottom-left">
                <div>
                    <button className="tombol" onClick={decreaseQty}>-</button>
                </div>
                <div>
                    <div className='tombol'>{qty}</div>
                </div>
                <div>
                    <button className="tombol" onClick={increaseQty}>+</button>
                </div>
            </div>
            <div className="bottom-right">
                {isAdmin ? (
                    <div>
                        {editableItem === 'name' ? (
                            <div>
                                <button className="tombol" onClick={increaseQty}>Batal</button>
                                <button className="tombol" onClick={increaseQty}>Simpan</button>
                            </div>
                        ) : (
                            <button className="tombol" onClick={cancelHandler}>Edit</button>
                        )}
                    </div>
                ) : (
                    <div>
                        {!listed ? (
                            <button className="tombol" onClick={increaseQty}>Tambahkan</button>
                        ) : (
                            <button className="tombol" onClick={cancelHandler}>Batalkan</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Item;