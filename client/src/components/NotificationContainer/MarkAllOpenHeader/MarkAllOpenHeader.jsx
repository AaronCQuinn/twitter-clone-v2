import React from 'react'
import './markAllOpenHeader.css'
import { Button } from 'react-bootstrap'

const MarkAllOpenHeader = ({ notifications, handleMarkAllOpenClick }) => {
    const COUNT = notifications.reduce((acc, obj) => obj['opened'] === false ? acc + 1 : acc, 0);

    return (
        <div className='markAllOpenHeader'>
            <Button disabled={COUNT === 0} className='markAllOpenButton' onClick={() => handleMarkAllOpenClick()}>
                {COUNT > 0 && <span className='markAllOpenCount'>{COUNT}</span>}
                Mark All Read
            </Button>
        </div>
    )
}

export default MarkAllOpenHeader