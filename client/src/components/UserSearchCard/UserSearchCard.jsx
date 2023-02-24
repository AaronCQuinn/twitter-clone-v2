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
  const {username, firstName, lastName} = item;

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
          className="userSearchCard"
          initial="hidden"
          animate="visible"
          exit={exitVariant}
          variants={variants}
          transition={{ duration: 0.3 }}
        >
          <div className="userSearchCardContent">
            <div className="userSearchCardInfo">
              <div className="userSearchCardName">
                {firstName} {lastName}
              </div>
              <div className="userSearchCardUsername">@{username}</div>
            </div>
            <div className="userSearchCardActions">
              <FontAwesomeIcon
                icon={faTimes}
                className="userSearchCardIcon"
                onClick={handleRemoveClick}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserSearchCard;
