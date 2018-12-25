const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const mongoose = require('mongoose');
const keys = require('./keys');
// Load user model
const User = mongoose.model('users');

// Container for strategies
let strategies = {};

// Google strategy
strategies.google =function(passport){
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret:keys.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(profile);

      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      const newUser = {
        socialID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: image
      }

      // Check for existing user
      User.findOne({
        socialID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}

// facebook strategy
strategies.facebook = function(passport) {
  passport.use(
    new FacebookStrategy({
      clientID: keys.facebookAppID,
      clientSecret: keys.facebookAppSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      image = profile.photos ? profile.photos[0].value : '/images/user.jpeg'
      const newUser = {
        socialID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: image
      }

      // Check for existing user
      User.findOne({
        socialID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}

// linkedin strategy
strategies.linkedin = function(passport){
  passport.use(new LinkedInStrategy({
    clientID: keys.linkedinClientID,
    clientSecret: keys.linkedinClientSecret,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
    proxy: true
  },
  (accessToken, refreshToken, profile, done) => {
    image = profile.photos ? profile.photos[0].value : '/images/user.jpeg'
    const newUser = {
      socialID: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      image: image
    }

    // Check for existing user
    User.findOne({
      socialID: profile.id
    }).then(user => {
      if(user){
        // Return user
        done(null, user);
      } else {
        // Create user
        new User(newUser)
          .save()
          .then(user => done(null, user));
      }
    })
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}

// twitter strategy
strategies.twitter = function(passport){

  passport.use(new TwitterStrategy({
    consumerKey: keys.twitterKey,
    consumerSecret: keys.twitterSecret,
    callbackURL: "/auth/twitter/callback",
    proxy: true
  },
  function(token, tokenSecret, profile, done) {
    image = profile.photos ? profile.photos[0].value : '/images/user.jpeg'
    const newUser = {
      socialID: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      image: image
    }

    // Check for existing user
    User.findOne({
      socialID: profile.id
    }).then(user => {
      if(user){
        // Return user
        done(null, user);
      } else {
        // Create user
        new User(newUser)
          .save()
          .then(user => done(null, user));
      }
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});
}

module.exports = strategies;
