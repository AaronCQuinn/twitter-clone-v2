import React, { useEffect } from 'react'
import { ContentContext } from '../../context/ContentContext';

const Posts = () => {
    const contentContext = useContext(ContentContext);
    console.log(contentContext.posts);

    useEffect(() => {
        
    }, [])

    return (
        <div className="post">
            <div className="mainContentContainer">
                <div className="userImageContainer">
                </div>
            </div>
        </div>
    )
}

export default Posts