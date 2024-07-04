const express = require('express');
const discussionController = require('../controllers/discussionController');
const auth = require('../middlewares/auth');
const router = new express.Router();

router.post('/discussion', auth, discussionController.createDiscussion);
router.patch('/discussion/:id', auth, discussionController.updateDiscussion);
router.delete('/discussion/:id', auth, discussionController.deleteDiscussion);
router.post('/discussion/:id/comment', auth, discussionController.commentOnDiscussion);
router.post('/discussion/:id/like', auth, discussionController.likeDiscussion);
router.post('/discussion/:discussionId/comment/:commentId/like', auth, discussionController.likeComment);
router.post('/discussion/:discussionId/comment/:commentId/reply', auth, discussionController.replyToComment);
router.get('/discussion/:id/view', discussionController.incrementViewCount);
router.get('/discussions/tag', discussionController.searchDiscussionByTag);
router.get('/discussions/text', discussionController.searchDiscussionByText);

module.exports = router;
