// Dependenices
// const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Container for User CURD
let users = {};

// User stories
users.stories = (req, res) => {
  Story.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
}

// Export the module
module.exports = users;
