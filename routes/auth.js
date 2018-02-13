const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    if(res.user){
      res.send('Loged In');
    }else{
      res.send('Not Loged In');
    }
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send(req.user);
    //res.redirect('/profile');
});

router.get('/current_user',(req,res)=>{
  res.send(req.user);
});

module.exports = router;
