import React from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import './searchbar.css'


const SearchBar = () => {
    const [input, setInput] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(input);
        }, 1000);
        
        return () => {
            clearInterval(timer);
        }

    }, [input])

    return (
        <div className='searchBarContainer'>
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input type="text" name='searchBox' id='searchBox' placeholder='Search for users or posts.' onChange={e => setInput(e.target.value.trim())}/>
        </div>
    )
}

export default SearchBar