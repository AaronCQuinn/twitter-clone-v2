import React from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import './searchbar.css'
import { useParams } from 'react-router-dom';
import { showToast } from '../Toast/showToast';


const SearchBar = ({ setLoading, setSearchResults }) => {
    const [input, setInput] = useState('');
    const params = useParams();

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
        const apiRoute = params.option === 'user' ? '/api/users' : '/api/posts';
        try {
            const search = await fetch(apiRoute + `/search?term=${encodeURIComponent(value)}`);
            if (search.ok) {
                let searchData = await search.json();
                console.log(searchData);
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