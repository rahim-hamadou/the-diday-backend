var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;
require('../models/connection');
const Media = require('../models/media');

const uniqid = require('uniqid');
const fs = require('fs');

router.post('/upload', async (req, res) => {
  try {
    const videoPath = `./tmp/${uniqid()}.mp4`;
    console.log(videoPath);
    const resultMove = await req.files.videoFromFront.mv(videoPath);
  
   if (!resultMove) {
     const resultCloudinary = await cloudinary.uploader.upload(videoPath, {
      resource_type: "auto",
    });
     res.json({ result: true, url: resultCloudinary.secure_url });
   } else {
     res.json({ result: false, error: resultMove });
   }
  
   fs.unlinkSync(videoPath);
  } catch(err) {
    console.log('Error', err);
  }
});

/* cloudinary.v2.uploader
.upload("dog.mp4", 
  { resource_type: "video", 
    public_id: "myfolder/mysubfolder/dog_closeup",
    chunk_size: 6000000,
    eager: [
      { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
      { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
    eager_async: true,
    eager_notification_url: "https://mysite.example.com/notify_endpoint" })
.then(result=>console.log(result)); */

module.exports = router;