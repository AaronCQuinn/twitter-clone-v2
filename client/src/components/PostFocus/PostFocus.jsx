import React, { useState } from 'react'
import { Col } from 'react-bootstrap/';
import Spinner from '../Spinner/Spinner';
import { useParams } from 'react-router-dom';

const PostFocus = ({widthOption}) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState();
    console.log(post);

    const getPost = async(id) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/post/${id}`);
            let data = await res.json();
            setPost(data);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get posts from the database: " + error);
        }
    }

    useState(() => {
        getPost(id);
    }, [])

    return (
        <Col className={"mainSectionContainer " + widthOption}>
            <div className="titleContainer">
                <h1 className='titleContainerTitle'>View Tweet</h1>
            </div>

            {loading ? <Spinner /> : <></>}
        </Col>
    )
}

export default PostFocus