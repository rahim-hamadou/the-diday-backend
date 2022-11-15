var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;
require('../models/connection');
const uniqid = require('uniqid');
const fs = require('fs');
const User = require('../models/users')

router.post('/upload/:tokenUser', async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  try {
    const videoPath = `./tmp/${uniqid()}.mp4`;
    console.log(videoPath);
    const resultMove = await req.files.videoFromFront.mv(videoPath);
  
   if (!resultMove) {
     const resultCloudinary = await cloudinary.uploader.upload(videoPath, {
      resource_type: "auto",
    });
    // modifier le sous document média avec l'url de resultCloudinary.secure_url
    //console.log(resultCloudinary.secure_url);
    User.updateOne({ token: req.params.tokenUser }, { media: { url: resultCloudinary.secure_url } } ).then(() => {
      User.findOne({ token: req.params.tokenUser }).then((data) => {
        if (data) {
            console.log("change  media ok");
          //res.json({ result: true, media: data.media });
        } else {
          res.json({ result: false, error: "Error Wrong task" });
        }
      });
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