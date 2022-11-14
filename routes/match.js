var express = require('express');
var router = express.Router();
const User = require('../models/users');
const mongoose = require('mongoose');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const Pusher = require('pusher');
const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });
const fs = require('fs');
const { match } = require('assert');
const { log } = require('console');

/* router.put('/likeSend', (req, res) => {
    //find avec le token renvoyé par le front pour récupérer toutes les données surtout l'ID
    User.updateOne({token:req.body.token}, {LikeReceived: req.body._id}).then((data) => {
        if (data) {
            res.json("ok")
        } else {
            res.json("error");
        }
    });
      }); */


/* ROUTE GET ALL USERS  */
router.get('/allUsers', (req, res)=> {
    User.find().then(data => {
        res.json({result: true, dataAllUsers : data})
    })
}); 

// route qui permet de get tout les matchs d'un users
router.post('/allMatch', (req, res)=> {
    User.findOne({token: req.body.tokenUserOne}).populate('match').then((data) =>{
        console.log("data",data);
        res.json(data)
    })
}); 

// route qui get le likeReceived d'un users
router.post('/allLikes', (req, res)=> {
    User.findOne({token: req.body.tokenUserOne}).populate('likeReceived').then((data) =>{
        console.log("data",data);
        res.json(data)
    })
}); 



/* ROUTE post ALL MATCH */
// router.post('/allMatch', (req, res)=> {
//     User.findOne({token: req.body.tokenUserOne}).then(data=> {
//         data.match.map(elt => {
//             User.findById(elt).then(dataUser => {
//                 let count = 0;
//                 console.log(dataUser );
//                 console.log("",count += 1 );


//             })
//         })
//         res.json({result: true, dataAllMatch : data.match})
//     })
// });  
/* ROUTE GET ALL LIKE */


// ROUTE LIKE !!
 router.post('/like', (req, res) => {
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => { // find l'user 1
        if(dataUserOne){
            User.findOne({token: req.body.tokenUserTwo}).then(dataUserTwo => { // find l'user deux
                if(dataUserOne.likeReceived.includes(dataUserTwo._id)) {
                    // on push notre id et its match
                    User.updateOne ({token : req.body.tokenUserTwo}, //là on va chercher user2 avec son token
                        {$addToSet: {likeReceived : dataUserOne._id}}).then(dataUpdate => { // rajoute l'id  user1 dans le likeReceived d'user2
                            if(dataUserTwo.likeReceived.includes(dataUserOne._id)) {
                                User.updateOne({token : req.body.tokenUserOne }, {$addToSet: {match : dataUserTwo._id}})
                                    .then(dataMatchUserOne => {
                                        User.updateOne({token: req.body.tokenUserTwo }, {$addToSet: {match : dataUserOne._id}})
                                            .then(dataMatchUserTwo => {
                                                console.log("dataMatchUserTwo")
                                                console.log("dataMatchUserOne")
                                                //res.json({result : true }); 
                                            })
                                    })
                            }
                            res.json({result : true, data: dataUserTwo.media.url});
                        })
                } else {
                    User.updateOne ({token : req.body.tokenUserTwo}, 
                        {$addToSet: {likeReceived : dataUserOne._id}}).then(dataUp => {
                            res.json({result : false, data: dataUserTwo.likeReceived + " no match just push"});
                    })
                }
            })
        } else {
            res.json("error");
        }
    }) 
});  


/*  router.post('/like', (req, res) => {
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => {
        if(dataUserOne){
            User.findOne({token: req.body.tokenUserTwo}).then(dataUserTwo => {
                if(dataUserOne.likeReceived.includes(dataUserTwo._id)) {
                    // on push notre id et its match
                    User.updateOne ({token : req.body.tokenUserTwo}, //là on va chercher user2 avec son token
                        {$addToSet: {likeReceived : dataUserOne._id}}).then(dataUpdate => {
                            res.json({result : true, data: dataUserTwo.likeReceived + " It's a match"});
                        })
                } else {
                    User.updateOne ({token : req.body.tokenUserTwo}, 
                        {$addToSet: {likeReceived : dataUserOne._id}}).then(dataUp => {
                            res.json({result : false, data: dataUserTwo.likeReceived + " no match just push"});
                    })
                }
        })
        } else {
            res.json("error");
        }
    }) 
});   */


/* ************************************ ROUTE DISLIKE !! ********************************************/

router.post('/dislike', (req, res) => {
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => {
        if(dataUserOne){
            User.findOne({token: req.body.tokenUserTwo}).then(dataUserTwo => {
                    // on push notre id 
                    User.updateOne ({token : req.body.tokenUserOne}, //là on va chercher user1 avec son token
                        {$addToSet: {dislikeSend : dataUserTwo._id}}).then(dataUpdate => {
                            res.json({result : true, data: dataUserTwo.dislikeSend + " dislikeSend"});
                    })
            })
        } else {
            res.json("error");
        }
    })
}); 

/* ************************************ ROUTE SUPERLIKE ********************************************/

router.post('/superLike', (req, res) => {
    //console.log(req);
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => {
        //console.log(dataUserOne);
        if(dataUserOne) {
            User.findOne({token: req.body.tokenUserTwo}).then(dataUserTwo => {
                console.log(dataUserOne.superlikeSend);
                if(dataUserOne.creditDemande) {
                    User.updateOne ({token : req.body.tokenUserOne}, //là on va chercher user1 avec son token
                        {$addToSet: {superlikeSend: {userID: dataUserTwo._id, creditDemande : false }}}).then(dataSuperlikeUserOne => {

                            res.json({result : true, data: " SuperLike Send"});
                        })
                } else {
                    res.json({result : false, data: " SuperLike Impossible"});
                }
            })
        } else {
            res.json("error");
        }
    })
});

/* ************************************ ROUTE SUPERLIKErefused ********************************************/

router.post('/superLikeRefused', (req, res) => {
    //console.log(req);
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => {
        //console.log(dataUserOne);
        if(dataUserOne) {
            User.findOne({token: req.body.tokenUserOne}).then(dataUserTwo => {
                    User.updateOne ({token: req.body.tokenUserOne }, //là on va chercher user1 avec son token
                        {$addToSet: {dislikeSend: {userID: dataUserTwo._id}}}).then(dataSuperlikeUserOne => {
    
                        res.json({result : false, data: dataUserTwo + " dislike" });
                    })
            })
        } else {
            res.json("error");
        }
    })
});





/* ***************************************************************************************************/

/* 
router.post('/dislike', (req, res) => {
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => {
        if(dataUserOne){
            User.findOne({token: req.body.tokenUserTwo}).then(dataUserTwo => {
                    // on push notre id 
                    User.updateOne ({token : req.body.tokenUserOne}, //là on va chercher user1 avec son token
                        {$addToSet: {dislikeSend : dataUserTwo._id}}).then(dataSuperlikeUserOne => {
                            User.updateOne({token : req.body.tokenUserTwo }, {$addToSet: {dislikeSend : dataUserTwo._id}})
                            .then(dataSuperlikeUserTwo => {
                                
                            })
                            res.json({result : true, data: dataUserTwo.dislikeSend + " dislikeSend"});
                    })
            })
        } else {
            res.json("error");
        }
    })
});  */

// updateOne si les deux users ont true => passer l'état du boolean du superlike des deux users en true 

// On trouve les deux users
// Puis on met mon _id dans superlikesend et on incrémente le credit de demande à 1 et on passe bothValidation = true  
//Allez checker si acceptDemande user 2 est à true => 

/* router.post('/superLike', (req, res) => {
    User.findOne({token: req.body.tokenUserOne}).then(dataUserOne => {
        if(dataUserOne) {
            User.findOne({token: req.body.tokenUserTwo}).then(dataUserTwo => {
                    // on push notre id 
                    User.updateOne ({token : req.body.tokenUserOne, }, //là on va chercher user1 avec son token
                        {$addToSet: {superlikeSend : dataUserTwo._id}}).then(dataUpdate => {
                            res.json({result : true, data: dataUserTwo.dislikeSend + " superlikeSend"});
                })
            })
        } else {
            res.json("error");
        }
    })
}); */



// trouvé le user connected par son token venu du front
// chercher dans son likeReceived tous les id
// chercher chaque user dans notre likeReceived et regarder dans son likeReceived si y'a notre id (match)
// return tout les token des users ou y'a match



module.exports = router;
