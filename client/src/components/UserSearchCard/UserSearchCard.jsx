import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './usersearchcard.css';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserSearchCard = ({
    item,
    setSelectedUsers,
    selectedUsers,
    }) => {
    const [isVisible, setIsVisible] = useState(true);
    const {username, profilePicture} = item;

    const variants = {
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.8 },
    };

    const exitVariant = {
        opacity: 0,
        scale: 0.8,
    };

    const handleRemoveClick = () => {
        setIsVisible(false);
    }

    const handleExitComplete = () => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== item._id))
    };

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
        {isVisible && (
            <motion.div
                key={item._id}
            initial="hidden"
            animate="visible"
            exit={exitVariant}
            variants={variants}
            transition={{ duration: 0.2 }}
            >
            <div className="userSearchCard">

                <div className="userSearchCardIconContainer">
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={handleRemoveClick}
                        size={'xs'}
                    />
                </div>

                <div className="userSearchCardInfo">
                    <div className="userImageContainer">
                        <img src={profilePicture} alt="The users profile identifier." />
                    </div>
                    <div className="userSearchCardUsername">@{username}</div>
                    </div>
                    <div className="userSearchCardActions">
                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default UserSearchCard;
