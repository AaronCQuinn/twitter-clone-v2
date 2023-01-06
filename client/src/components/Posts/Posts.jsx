import React, { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner';
import './posts.css'
import Tweet from '../Tweet/Tweet';

const Posts = ({ user }) => {
    const [posts, setPosts] = useState({});
    const [loading, setLoading] = useState(true);
    
    const getPosts = async() => {
        setLoading(true);
        try {
            let res = await fetch(`/api/posts`);
            let data = await res.json();
            setPosts(data);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get posts from the database: " + error);
        }
    }

    useEffect(() => {
        getPosts();
        // eslint-disable-next-line
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (!posts) {
        return <div>No posts to display.</div>
    }

    return (
        posts.map((post) => {
            return <Tweet post={post} key={post._id} user={user} />
        })
    )
  };    
export default Posts