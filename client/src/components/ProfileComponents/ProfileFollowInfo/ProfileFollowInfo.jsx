import React, {useState} from 'react'
import { useParams } from 'react-router-dom';

const ProfileFollowInfo = () => {
    const params = useParams();
    const [isSelected, setIsSelected] = useState(params.follow);
    return (
        <div className="tabsContainer">
            <span className={`tab ${isSelected === 'following' && 'active'}`} onClick={() => setIsSelected('following')}>
                Following
            </span>
            <span className={`tab ${isSelected === 'followers' && 'active'}`} onClick={() => setIsSelected('followers')}>
                Followers
            </span>
        </div>
    )
}

export default ProfileFollowInfo