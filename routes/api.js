const router = require('express').Router();
const fetch = require('node-fetch');
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELPAPI);

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

module.exports = router;
