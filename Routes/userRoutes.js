const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single user by _id and populate thought and friend data
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a user by _id
router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a user and their thoughts
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Thought.deleteMany({ username: user.username }); // Remove thoughts associated with user
    res.json({ message: 'User and their thoughts deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a friend
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }
    user.friends.push(friend);
    friend.friends.push(user);
    await user.save();
    await friend.save();
    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove a friend
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }
    user.friends.pull(friend);
    friend.friends.pull(user);
    await user.save();
    await friend.save();
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
