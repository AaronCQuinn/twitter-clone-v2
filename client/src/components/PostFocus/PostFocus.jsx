import React, { useState, useContext } from 'react'
import { Col } from 'react-bootstrap/';
import Spinner from '../Spinner/Spinner';
import PageHeader from '../PageHeader/PageHeader';
import { useParams } from 'react-router-dom';
import Tweet from '../Tweet/Tweet';
import { AuthContext } from '../../context/AuthContext';
import './postfocus.css'

const PostFocus = ({widthOption}) => {
    const { loggedInUser } = useContext(AuthContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState();
    const [postReplies, setPostReplies] = useState();

    const getPost = async(id) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/post/${id}`);
            let data = await res.json();
            setPost(data.tweet);
            setPostReplies(data.replies);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get posts from the database: " + error);
        }
    }

    useState(() => {
        getPost(id);
    }, [])

    return (
        <Col className={"mainSectionContainer "}>
            <PageHeader title={'View Tweet'} />

            {loading ? <Spinner /> : <Tweet post={post} user={loggedInUser} />}
            <PageHeader title={'Replies'} />

            {loading ? <Spinner /> 
                : postReplies.length > 0 ?          
                postReplies.map((post) => {
                    return <Tweet post={post} key={post._id} user={loggedInUser} />
                })
                : 
                <>
                    <div className='noReplyText'>This tweet has no replies yet!</div>
                </>
            }
        </Col>
    )
}

export default PostFocus