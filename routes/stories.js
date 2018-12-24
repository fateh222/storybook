const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const stories = require('../app/controllers/stories');
const users = require('../app/controllers/users');
const comments = require('../app/controllers/comments');
const {ensureAuthenticated, ensureGuest} = require('../app/helpers/auth');

// stories index
router.get('/', stories.read);

// Add Story Form
router.get('/add', ensureAuthenticated, stories.add);

// Process Add Story
router.post('/', stories.create);

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, stories.edit);

// Edit Form Process
router.put('/:id', stories.update);

// Show Single Story
router.get('/show/:id', stories.show);

// Delete Story
router.delete('/:id', stories.delete);

// List stories from a user
router.get('/user/:userId', users.stories);

// Logged in users stories
router.get('/my', ensureAuthenticated, stories._users.show);

// Add Comment
router.post('/comment/:id', comments.add);

// Export the module
module.exports = router;
