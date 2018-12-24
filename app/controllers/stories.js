// Dependenices
// const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');


// Container for Stories CURD
const stories = {};

// Stories Index
stories.read = (req, res) => {
  Story.find({status:'public'})
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
}

// Create story
stories.create = (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments:allowComments,
    user: req.user.id
  }

  // Create Story
  new Story(newStory)
    .save()
    .then(story => {
      req.flash('success_msg', 'Story added');
      res.redirect(`/stories/show/${story.id}`);
    });
}

// Update Story
stories.update = (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;

    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => {
        req.flash('success_msg', 'Story updated');
        res.redirect('/dashboard');
      });
  });
}

// Delete Story
stories.delete = (req, res) => {
  Story.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Story deleted');
      res.redirect('/dashboard');
    });
}

// Add new story
stories.add = (req, res) => {
  res.render('stories/add');
}

// Edit  story
stories.edit = (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    if(story.user != req.user.id){
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story: story
      });
    }
  });
}

// Show Story
stories.show = (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story => {
    if(story.status == 'public'){
      res.render('stories/show', {
        story:story
      });
    } else {
      if(req.user){
        if(req.user.id == story.user._id){
          res.render('stories/show', {
            story:story
          });
        } else {
          res.redirect('/stories');
        }
      } else {
        res.redirect('/stories');
      }
    }
  });
}

// Container for the users submethods
stories._users = {};

// Logged in users stories
stories._users.show = (req, res) => {
  Story.find({user: req.user.id})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories:stories
      });
    });
};

// Export the module
module.exports = stories;
