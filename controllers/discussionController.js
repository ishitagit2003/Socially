const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
  const { text, image, hashtags } = req.body;
  const discussion = new Discussion({
    user: req.user._id,
    text,
    image,
    hashtags
  });
  try {
    await discussion.save();
    res.status(201).send(discussion);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateDiscussion = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['text', 'image', 'hashtags'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const discussion = await Discussion.findOne({ _id: req.params.id, user: req.user._id });
      if (!discussion) {
        return res.status(404).send();
      }
  
      updates.forEach(update => discussion[update] = req.body[update]);
      await discussion.save();
      res.send(discussion);
    } catch (e) {
      res.status(400).send(e);
    }
  };
  
  exports.deleteDiscussion = async (req, res) => {
    try {
      const discussion = await Discussion.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!discussion) {
        return res.status(404).send();
      }
      res.send(discussion);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.commentOnDiscussion = async (req, res) => {
    const { text } = req.body;
    try {
      const discussion = await Discussion.findById(req.params.id);
      if (!discussion) {
        return res.status(404).send();
      }
      discussion.comments.push({ user: req.user._id, text });
      await discussion.save();
      res.send(discussion);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.likeDiscussion = async (req, res) => {
    try {
      const discussion = await Discussion.findById(req.params.id);
      if (!discussion) {
        return res.status(404).send();
      }
      if (!discussion.likes.includes(req.user._id)) {
        discussion.likes.push(req.user._id);
      }
      await discussion.save();
      res.send(discussion);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.likeComment = async (req, res) => {
    try {
      const discussion = await Discussion.findById(req.params.discussionId);
      if (!discussion) {
        return res.status(404).send();
      }
      const comment = discussion.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send();
      }
      if (!comment.likes.includes(req.user._id)) {
        comment.likes.push(req.user._id);
      }
      await discussion.save();
      res.send(discussion);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.replyToComment = async (req, res) => {
    const { text } = req.body;
    try {
      const discussion = await Discussion.findById(req.params.discussionId);
      if (!discussion) {
        return res.status(404).send();
      }
      const comment = discussion.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send();
      }
      comment.replies.push({ user: req.user._id, text });
      await discussion.save();
      res.send(discussion);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.incrementViewCount = async (req, res) => {
    try {
      const discussion = await Discussion.findById(req.params.id);
      if (!discussion) {
        return res.status(404).send();
      }
      discussion.viewCount += 1;
      await discussion.save();
      res.send(discussion);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.searchDiscussionByTag = async (req, res) => {
    const tag = req.query.tag;
    try {
      const discussions = await Discussion.find({ hashtags: tag });
      res.send(discussions);
    } catch (e) {
      res.status(500).send(e);
    }
  };
  
  exports.searchDiscussionByText = async (req, res) => {
    const text = req.query.text;
    try {
      const discussions = await Discussion.find({ text: new RegExp(text, 'i') });
      res.send(discussions);
    } catch (e) {
      res.status(500).send(e);
    }
  };