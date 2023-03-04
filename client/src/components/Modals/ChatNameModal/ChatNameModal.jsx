import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { showToast } from '../../Toast/showToast';

const ChatNameModal = ({modalShow, setModalShow, id, setChatTitle}) => {
    let [chatName, setChatName] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/chats/update/${id}`, {chatName: chatName}, {
              headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                setChatTitle(response.data.chatName)
            })
        } catch (error) {
            showToast('There was an error updating the chat name, please try again!', 'error');
            console.log(`Error posting to back end: ${error}`);
        } finally {
            setModalShow(false);
        }
    }

    return (
        <Modal
        show={modalShow}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton onClick={() => { setModalShow(false) }}>
            <Modal.Title id="contained-modal-title-vcenter">
                Chat Name
            </Modal.Title>
        </Modal.Header>

        <Modal.Body className='d-flex align-items-center justify-content-center'>
            <input type="text" onChange={(e) => setChatName(e.target.value)} />
        </Modal.Body>

        <Modal.Footer>
            <Button disabled={!Boolean(chatName.trim())} onClick={onSubmit}>Set Name</Button>
            <Button variant='secondary' onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default ChatNameModal