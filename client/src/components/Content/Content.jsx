import React from 'react'
import { Col } from 'react-bootstrap/';
import PostForm from '../PostForm/PostForm';
import Posts from '../Posts/Posts';
import {useState, useEffect} from 'react'
import Spinner from '../Spinner/Spinner';

import './content.css'

const Content = ({ widthOption }) => {
    const [posts, setPosts] = useState({});
    const [loading, setLoading] = useState(true);

    const getPosts = async() => {
        setLoading(true);
        try {
            let res = await fetch(`/api/posts`);
            let data = await res.json();
            setPosts(data);
            setLoading(false);
            console.log(data);
        } catch(error) {
            console.log("Error trying to get posts from the database: " + error);
        }
    }

    useEffect(() => {
        getPosts();
        // eslint-disable-next-line
    }, [])

    
    if (loading) {
        return (
            <Col className={"mainSectionContainer " + widthOption}>
                <div className="titleContainer">
                    <h1 className='titleContainerTitle'>Home</h1>
                </div>
                <PostForm />
                <Spinner />
            </Col>
        )
    } else {
        return (
            <Col className={"mainSectionContainer " + widthOption}>
                <div className="titleContainer">
                    <h1 className='titleContainerTitle'>Home</h1>
                </div>
                <PostForm setPosts={setPosts} getPosts={getPosts}/>
                <Posts posts={posts} />
            </Col>
        )
    }
}

export default Content