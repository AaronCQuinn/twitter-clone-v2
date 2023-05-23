const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "uploads/" });
const { fetchImage, uploadProfilePicture, uploadCoverPhoto } = require('../controllers/imageController');

router.get('/images/:path', fetchImage);
router.post('/images/:username/profilePicture', upload.single('profilePictureImage'), uploadProfilePicture); 
router.post('/images/:username/coverPhoto', upload.single('profilePictureImage'), uploadCoverPhoto);

module.exports = router;