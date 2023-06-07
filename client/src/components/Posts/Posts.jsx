import React, { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner';
import './posts.css'
import Tweet from '../Tweet/Tweet';

const Posts = ({ user }) => {
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState();
    
    const getPosts = async() => {
        setLoading(true);
        try {
            let res = await fetch(`/api/feed/main_feed`);
            let data = await res.json();
            setPosts(data);
            setLoading(false);
        } catch(error) {
            setError(true);
            console.log("Error trying to get posts from the database: " + error);
        }
    }

    useEffect(() => {
        getPosts();
        // eslint-disable-next-line
    }, [])

    if (error) {
        return <div className='noTweetError'>There was an error fetching your feed from the database. <br/> Please try again.</div>
    }

    if (loading) {
        return <Spinner />;
    }

    if (!posts) {
        return <div className='noTweetError'>No posts to display.</div>;
    }

    return (
        posts.map((post, index) => { return <Tweet post={post} key={index} user={user} /> })
    )
  };    
export default Posts