import React, { useEffect, useState, useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {showToast} from '../../Toast/showToast'
import axios from 'axios';
import Cropper from "react-cropper";
import { AuthContext } from '../../../context/AuthContext';
import '../ReplyModal/replymodal.css'
import '../UploadProfilePicModal/uploadmodal.css'
import "cropperjs/dist/cropper.css";

const UploadCoverPhotoModal = ({ setShowUploadCoverPhotoModal, showUploadCoverPhotoModal }) => {
    const [image, setImage] = useState();
    const [cropper, setCropper] = useState();
    const [postError, setPostError] = useState();
    const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

    useEffect(() => {
        showToast(postError, 'error');
    }, [postError])

    const onChange = (e) => {
        e.preventDefault();
        try {
            let files;
            if (e.dataTransfer) {
                files = e.dataTransfer.files;
            } else if (e.target) {
                files = e.target.files;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } catch(error) {
            setPostError('There was an error cropping your image.')
        }
    };
  
    const onSubmit = (e) => {
        e.preventDefault();
        try { 
            cropper.getCroppedCanvas().toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('profilePictureImage', blob);
                await axios.post(`/api/images/${loggedInUser.username}/coverPhoto`, formData, { headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    setLoggedInUser(prevState => ({...prevState, coverPhoto: response.data.coverPhoto}));
                })
            });
        } catch(error) {
            setPostError('There was an error uploading your image. Please try again.');
            console.log(`Error posting to back end: ${error}`);
        } finally {
            window.location.reload();
        }
    }

    return (
        <Modal
            show={showUploadCoverPhotoModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
        <Modal.Header closeButton onClick={() => { setShowUploadCoverPhotoModal(false) }}>
            <Modal.Title id="contained-modal-title-vcenter">
            Upload a New Cover Photo
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="uploadMainContentContainer">
                <div style={{ width: "100%" }}>
                    <input type="file" onChange={onChange} />
                    <Cropper
                        style={{ width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={16 / 9}
                        preview=".img-preview"
                        src={image}
                        cropBoxResizable={false}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                        guides={true} />
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='primary' onClick={onSubmit}>
                Upload
            </Button>
            <Button variant='secondary' onClick={() => { setShowUploadCoverPhotoModal(false) }}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default UploadCoverPhotoModal