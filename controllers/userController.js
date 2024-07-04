const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, mobileNo, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, mobileNo, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY,);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY,);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'mobileNo', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      updates.forEach(update => req.user[update] = req.body[update]);
      if (req.body.password) {
        req.user.password = await bcrypt.hash(req.user.password, 8);
      }
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  };
  
  exports.deleteUser = async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.searchUser = async (req, res) => {
    const name = req.query.name;
    try {
      const users = await User.find({ name: new RegExp(name, 'i') });
      res.send(users);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.followUser = async (req, res) => {
    const userIdToFollow = req.params.id;
    try {
      const userToFollow = await User.findById(userIdToFollow);
      if (!userToFollow) {
        return res.status(404).send({ error: 'User not found' });
      }
      req.user.following.push(userToFollow._id);
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
};