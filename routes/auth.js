const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login with google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/dashboard');
  });

// Login with facebook
router.get('/facebook',
  passport.authenticate('facebook', { scope:'email'  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }),(req, res) => {
    res.redirect('/dashboard');
  }
);

// Login with linkedin
// app.get('/linkedin', passport.authenticate('linkedin'));
router.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE'  }));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }),(req, res) => {
    res.redirect('/dashboard');
  }
);

// Login with Twitter
router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect('/dashboard');
  });


router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req);
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

router.get('/logout', (req, res) => {
 req.logout();
 req.flash('success_msg', 'Successfully logout');
 res.redirect('/');
});
module.exports = router;
