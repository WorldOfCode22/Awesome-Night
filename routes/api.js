const router = require('express').Router();
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELPAPI);
const User = require("../models").User;
const Bar = require("../models").Bar;
const ErrorLog = require('../config/error-codes.js');
router.get('/bars/:location',(req,res)=>{
    let barResults = [];
    client.search({
      location:req.params.location,
      radius: 40000,
    }).then(response=>{
      for(let i =0; i<response.jsonBody.businesses.length;i++){
        for(let x = 0; x<response.jsonBody.businesses[i].categories.length;x++){
          if(response.jsonBody.businesses[i].categories[x].alias === 'bars'){
            barResults.push(response.jsonBody.businesses[i]);
            continue;
          }
        }
      }
      if(barResults.length === 20){
      res.json({businesses: barResults});
    }else{
      for(let a = 0; a<response.jsonBody.businesses.length;a++){
        for(let b = 0; b<response.jsonBody.businesses[a].categories.length;b++){
          if(response.jsonBody.businesses[a].categories[b].alias !== 'bars'){
            barResults.push(response.jsonBody.businesses[a]);
            if(barResults.length === 20){
              console.log(barResults.length);
              res.json({businesses: barResults});
              break;
            }
          }
      }
    }
    }
  })
})
//vailidate yelpID
//vailidate not already going
router.get('/going/:yelpId',(req,res)=>{
  if(!req.user){
    res.send(ErrorLog.Error102);
  }else{
    User.findById(req.user.id).then((user)=>{
      if(user){
        user.goingTo.push(req.params.yelpId);
        return user.save().then(user=>{
          return user;
        })
      }else{
        res.send(ErrorLog.Error103)
      }
    }).then((user)=>{
      return Bar.findOne({yelpId:req.params.yelpId}).exec().then(bar=>{
        if(bar){
          bar.usersGoing.push(req.user.id);
          return bar.save().then(()=>{
            res.json({operation: "Finished"});
          }).catch(e=>{
            console.log(e);
          })
        }else{
          return new Bar({
            yelpId: req.params.yelpId,
            usersGoing: [req.user.id]
          }).save().then(()=>{
            res.json({operation: "Finished"});
          }).catch(e=>{
            console.log(e);
          })
        }
      }).catch(e=>{
        console.log(e)
      })
    }).catch(e=>{
      console.log(e);
    })
  }
})
module.exports = router;
