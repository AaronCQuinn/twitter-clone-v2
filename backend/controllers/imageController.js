const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const issueClientData = require('../util/issueClientData');

const fetchImage = async(req, res) => {
    res.sendFile(path.join(__dirname, '../uploads/' + req.params.path))
};

const uploadProfilePicture = async(req, res) => {
    const { username, _id } = req.cookies.decodedToken;
    const requestedUsername = req.params.username;
  
    if (username !== requestedUsername) {
      return res.sendStatus(401);
    }
  
    if (!req.file) {
      return res.sendStatus(400);
    }
  
    const filepath = `/backend/uploads/${req.file.filename}.png`;
    const targetPath = path.join(__dirname, `../../${filepath}`);
  
    fs.rename(req.file.path, targetPath, error => {
      if (error) {
        console.log(error);
        return res.sendStatus(400);
      }
    });
  
    const returnUser = await User.findOneAndUpdate({_id: _id}, {profilePicture: `/api/images/${req.file.filename}.png` }, { new: true });
    const clientData = issueClientData(returnUser);
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true })
  
    return res.status(200).send(clientData);
}

const uploadCoverPhoto = async(req, res) => {
    const { username, _id } = req.cookies.decodedToken;
    const requestedUsername = req.params.username;

    if (username !== requestedUsername) {
      return res.sendStatus(401);
    }

    if (!req.file) {
      return res.sendStatus(400);
    }

    const filepath = `/backend/uploads/${req.file.filename}.png`;
    const targetPath = path.join(__dirname, `../../${filepath}`);
    console.log(targetPath);

    fs.rename(req.file.path, targetPath, error => {
      if (error) {
        console.log(error);
        return res.sendStatus(400);
      }
    });

    const returnUser = await User.findOneAndUpdate(_id, { coverPhoto: `/api/images/${req.file.filename}.png` }, { new: true });
    const clientData = issueClientData(returnUser);
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true })

    return res.status(200).send(clientData);
}

module.exports = { fetchImage, uploadProfilePicture, uploadCoverPhoto };