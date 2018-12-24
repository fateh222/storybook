// Dependenices
const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');

// Container for CURD comments
let comments = {};

// Add Comment
comments.add = (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    // Add to comments array
    story.comments.unshift(newComment);

    story.save()
      .then(story => {
        res.redirect(`/stories/show/${story.id}`);
      });
  });
}

// Export the module
module.exports = comments;
