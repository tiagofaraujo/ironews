const router = require("express").Router();
const Comment = require("../models/Comments.model");
const { isLoggedIn, isAdmin } = require("../middleware/route-guard");

//ALL Comments
router.get("/comments", isLoggedIn, (req, res, next) => {
  Comment.find()
    .then((comment) => {
      console.log(comment);
      res.render("news/news-details", {
        comments: comment,
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => console.log("error getting news articles", err));
});

router.post("/comments/create/:newsId", isLoggedIn, (req, res) => {
  console.log(req.body);
  const { newsId } = req.params;
  const { commentContent } = req.body;
  Comment.create({
    userId: req.session.currentUser._id,
    newsId: newsId,
    commentContent: commentContent,
  })
    .then((comment) => {
      console.log("new comment was created: " + comment);
      res.redirect(`/news/${newsId}`);
    })
    .catch((error) => {
      console.log("An error occurred while creating a New comment: " + error);
      res.render("news/news-details");
    });
});

//POST for delete
router.post("/comments/:commentId/delete", isLoggedIn, (req, res) => {
  const { commentId } = req.params;
  Comment.findById().then((comment) => {
    console.log(comment);
    /*  if(req.session.currentUser._id === comment.userId){ */
    Comment.findByIdAndRemove(commentId)
      .then((comment) => {
        console.log(comment + "was deleted.");
        res.redirect(`/news/${comment.newsId}`);
      })
      .catch((error) => {
        console.log("Something went wrong while deleting an comment: ", error);
      });
  });
});

//POST for edit comments
/* router.get("/comments/:commentId/edit", isLoggedIn,(req, res) => {
  const { commentId } = req.params;
  Comment.findById(commentId)
  .then((commentToEdit) => {
      res.render("comments/comment", {comments:commentToEdit});
  })
  .catch((err) => console.log("error getting comments to edit", err));
});

  router.post('/comments/:commentId/edit',isLoggedIn, (req, res, next) => {
    const { commentId } = req.params;
    const { content} = req.body;
   
   Comment.findByIdAndUpdate(commentId, {  
       content: content}, { new: true })
      .then(() =>{
        res.redirect(`/comments/${commentId}`) // go to the details page to see the updates
      } )
      .catch(error => next(error));
  }); */

module.exports = router;
