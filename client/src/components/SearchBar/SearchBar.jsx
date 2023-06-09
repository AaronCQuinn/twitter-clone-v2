import React from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import './searchbar.css'
import { showToast } from '../Toast/showToast';


const SearchBar = ({ setLoading, setSearchResults, isSelected }) => {
    const [input, setInput] = useState('');

    useEffect(() => {
        if (input) {
            setLoading(true);
            const timer = setTimeout(() => {
                handleSearch(input);
            }, 1000);
            
            return () => {
                clearInterval(timer);
                setLoading(false);
            }
        }
        // eslint-disable-next-line
    }, [input])

    const handleSearch = async (value) => {
        const apiRoute = isSelected === 'users' ? '/api/search/users' : '/api/search/posts';
        try {
            const search = await fetch(apiRoute + `?term=${encodeURIComponent(value)}`);
            if (search.ok) {
                let searchData = await search.json();
                setSearchResults(searchData);
            } else {
                throw new Error();
            }
        } catch(error) {
            console.log(error);
            showToast('An error occured while trying to complete the search.', 'error');
        } finally {
            setLoading(false);
        }
    } 

    return (
        <div className='searchBarContainer'>
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input type="text" name='searchBox' id='searchBox' placeholder='Search for users or posts.' onChange={e => setInput(e.target.value.trim())}/>
        </div>
    )
}

export default SearchBar