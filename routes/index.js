var express = require('express');
var router = express.Router();

// config pusher 
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs'); // module pour déplacer les fichier

var socketId = null;
// Join chat
router.put('/users/:username/:channel', (req, res) => {
 /*  pusher.connection.bind("connected", () => { // recupération de socketId
  socketId = pusher.connection.socket_id;
}); */
  const authResponse = pusher.authorizeChannel("137467.5400872", `private-${req.params.channel}`);
  console.log(authResponse);
  // rejoindre un channel par la methode trigger
  pusher.trigger(`private-${req.params.channel}`, 'join', { username: req.params.username });

  res.json({ result: true, authResponse });
});

// pusher.trigger(`private-${req.params.channel}`, 'leave', { username: req.params.username });
// Leave chat
router.delete("/users/:username/:channel", (req, res) => {
  // permet de quitter le channel
  pusher.trigger(`private-${req.params.channel}`, 'leave', { username: req.params.username });

  res.json({ result: true });
});

// Send message
router.post('/message/:channel', async (req, res) => {
  const message = req.body;
  console.log("req => ", message);

  if (message.type === 'audio') {
    const audioPath = `./tmp/${uniqid()}.m4a`; // créer un chemin 
    const resultMove = await req.files.audio.mv(audioPath); // déplacer vers le chemin tmp et return une reponse

    if (!resultMove) { // verifier si resultMove est vide on rentre dans le if
      const resultCloudinary = await cloudinary.uploader.upload(audioPath, { resource_type: 'video' }); // sert a envoyer vers cloudinary
      message.url = resultCloudinary.secure_url;
      console.log(message);
      fs.unlinkSync(audioPath); // sert a delete de tmp
    } else {
      res.json({ result: false, error: resultMove });
      return;
    }
  }

  pusher.trigger(req.params.channel, 'message', message);

  res.json({ result: true });
});


//use JWTs here to authenticate users before continuing

/* export default async function handler( req, res ) {
  // see https://pusher.com/docs/channels/server_api/authenticating-users
  const { socket_id, channel_name, username, userLocation } = req.body;

  // use JWTs here to authenticate users before continuing

  const randomString = Math.random().toString(36).slice(2);

  const presenceData = {
    user_id: randomString,
    user_info: {
      username: "@" + username,
      userLocation
    },
  };

  try {
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    res.send(auth);    
  } catch (error) {
      console.error(error)
  }
} */


// Pour la presence

/* export default async function handler(req, res) {
  const { message, username, userLocation } = req.body;
  // trigger a new post event via pusher
  await pusher.trigger("presence-channel", "chat-update", {
    message,
    username,
    userLocation
  });

  res.json({ status: 200 });
} */

/* router.post("/message", (req, res) => {
  console.log(req.body)
  const socketId = req.body.socket_id;

  // Replace this with code to retrieve the actual user id and info
  const user = {
    id: "12345",
    user_info: {
      name: "John Smith",
    }
  };
  const authResponse = pusher.authenticateUser(socketId, user);
  res.send(authResponse);
}); */








/* app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const authResponse = pusher.authorizeChannel(socketId, channel);
  res.send(authResponse);
}); */





module.exports = router;
