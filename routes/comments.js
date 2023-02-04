const router = require("express").Router();
const Comment = require ("../models/Comments.model")
const {isLoggedIn, isAdmin} = require("../middleware/route-guard")

//ALL Comments
router.get("/comments", isLoggedIn, (req, res, next) => {
  Comment.find()
    .then((comment) => {
      console.log(comment);
      res.render("comments/comment", { comments:comment , userInSession: req.session.currentUser });
    })
    .catch((err) => console.log("error getting news articles", err));
});

// NEW Comment
  router.get('/comments/create', isLoggedIn,(req, res) => {
    res.render('comments/comment')
  })

router.post("/comments/create", isLoggedIn, (req, res) => {
    console.log(req.body);
     const {userId,content} = req.body;
     Comment.create({
      userId:req.session.currentUser._id,
       content: content,
          })
     .then((comment) => {
      console.log("new comment was created: " + comment);
      res.redirect("/comments");
   })
   .catch((error) => {
    console.log("An error occurred while creating a New comment: " + error);
    res.render("/comments/comment");
  });
});

 //POST for delete
 router.post("/comments/:commentId/delete",isLoggedIn, (req, res) => {
  const { commentId } = req.params;

 Comment.findByIdAndRemove(commentId)
    .then((comment) => {
      console.log(comment + "was deleted.");
      res.redirect("/comments");
    })
    .catch((error) => {
      console.log("Something went wrong while deleting an comment: ", error);
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