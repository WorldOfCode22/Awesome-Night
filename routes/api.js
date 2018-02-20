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
      res.json({businesses:response.jsonBody.businesses});
  }).catch(()=>{
    res.json({error: "No Results Found"});
  })
})

router.get('/going/:yelpId',(req,res)=>{
  console.log(req.user);
  if(!req.user){
    res.json(ErrorLog.Error102);
  }else{
    client.business(req.params.yelpId).then((doc)=>{
      if(doc){
      console.log(doc);
    }
  }).catch(e=>{
    var errorParse = JSON.parse(e.response.body);
    console.log(errorParse.error.code);
    if(errorParse.error.code === "BUSINESS_NOT_FOUND"){

      return null;
    }
  }).then((val)=>{
      if(val === null){
        res.send(ErrorLog.Error104);
        return null
      }
      return User.findById(req.user.id).then((user)=>{
        if(user){
          let index = user.goingTo.indexOf(req.params.yelpId);
          if( index !== -1){
            user.goingTo = user.goingTo.splice(index,1);
            res.json({operation: "Removed"});
            return null;
          }
          user.goingTo.push(req.params.yelpId);
          return user.save().then(user=>{
            return user;
          })
        }else{
          res.send(ErrorLog.Error103)
        }
      }).then((user)=>{
        if(user === null){
          return null;
        }
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
    })
  }
})

router.get('/numberGoing/:yelpId',(req,res)=>{
  Bar.findOne({yelpId:req.params.yelpId}).then(bar=>{
      if(bar === null){
        res.json({numberGoing: 0});
        return null;
      }
      res.json({numberGoing: bar.usersGoing.length});
  })
})
module.exports = router;
