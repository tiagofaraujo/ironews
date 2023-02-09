const router = require("express").Router();
const News = require("../models/News.model");
const { isLoggedIn, isAdmin } = require("../middleware/route-guard");
const Comment = require("../models/Comments.model");

const fileUploader = require("../config/cloudinary.config");

//all news articles

router.get("/news", isLoggedIn, (req, res, next) => {
  console.log(req.session.currentUser);
  News.find()
    .then((news) => {
      console.log(news);
      res.render("news/news", {
        news: news,
        userInSession: req.session.currentUser,
        isAdmin: req.session.currentUser.admin,
      });
    })
    .catch((err) => console.log("error getting news articles", err));
});

//POST for create
const categoryArray = [
  "Ironhack News",
  "You Might Also Like",
  "Backend",
  "Frontend",
];

router.get("/news/create", isLoggedIn, (req, res, next) => {
  res.render("news/create-news", { categoryArray });
});

//fileUploader.single('news-image'),

router.post(
  "/news/create",
  isLoggedIn,
  fileUploader.single("cover-image"),
  (req, res) => {
    console.log(req.body);
    const { title, category, image, content, owner } = req.body;
    console.log(req.file);
    console.log(req.file.path);
    News.create({
      title: title,
      category: category,
      image: req.file.path,
      content: content,
      owner: req.session.currentUser._id,
    })
      .then((result) => {
        console.log("new article was created: " + result);
        res.redirect("/news");
      })
      .catch((error) => {
        console.log("An error occurred while creating a New article: " + error);
        res.render("/news/create-news");
      });
  }
);

//POST for edit
router.get("/news/:newsId/edit", isLoggedIn, isAdmin, (req, res) => {
  const { newsId } = req.params;
  News.findById(newsId)
    .then((newsToEdit) => {
      res.render("news/edit-news", { news: newsToEdit, categoryArray });
    })
    .catch((err) => console.log("error getting news articles to edit", err));
});

router.post("/news/:newsId/edit", isLoggedIn, isAdmin, (req, res, next) => {
  const { newsId } = req.params;
  const { title, category, image, content } = req.body;

  News.findByIdAndUpdate(
    newsId,
    {
      title: title,
      category: category,
      image: image,
      content: content,
    },
    { new: true }
  )
    .then(() => {
      res.redirect(`/news/${newsId}`); // go to the details page to see the updates
    })
    .catch((error) => next(error));
});

//Details route
router.get("/news/:newsId", isLoggedIn, (req, res) => {
  const { newsId } = req.params;

  News.findById(newsId)
    .populate("owner")

    .then((result) => {
      const comments = Comment.find({ newsId: newsId }).populate("userId").then(
        (resultComments) => {
          console.log(result);
          console.log(resultComments);
          resultComments.forEach((element) => {
            console.log("Elem " + element.userId);
            if (element.userId == req.session.currentUser._id)
              element.commentSelf = true;
            else element.commentSelf = false;
          });
          res.render("news/news-details", {
            result,
            comments: resultComments,
            isAdmin: req.session.currentUser.admin,
          });
        }
      );
    })
    .catch((err) => console.log("error getting news-details", err));
});

//POST for delete
router.post("/news/:newsId/delete", isLoggedIn, isAdmin, (req, res) => {
  const { newsId } = req.params;

  News.findByIdAndRemove(newsId)
    .then((news) => {
      console.log(news + "was deleted.");
      res.redirect("/news");
    })
    .catch((error) => {
      console.log("Something went wrong while deleting an article: ", error);
    });
});

//Routes for categories
/* ---Latest News----
This category is not in the news model, 
it is just a method to reverse the order of the news, 
so that the user sees the last created news. */
router.get("/news/categories/latest", isLoggedIn, (req, res) => {
  News.find()
    .then((result) => {
      console.log(result);
      res.render("news/categories/latest", {news:result.reverse()});
    })
    .catch((err) => console.log("error getting latest news", err));
});
///Ironhack News
router.get("/news/categories/ironhack", isLoggedIn, (req, res) => {
  News.find({ category: "Ironhack News" })
    .then((result) => {
      console.log(result);
      res.render("news/categories/ironhack", { news: result });
    })
    .catch((err) => console.log("error getting ironhack news", err));
});
///You might also like
router.get("/news/categories/might-like", isLoggedIn, (req, res) => {
  News.find({ category: "You Might Also Like" })
    .then((result) => {
      console.log(result);
      res.render("news/categories/might-like.hbs", {news:result});
    })
    .catch((err) => console.log("error getting you might also like news", err));
});

///Back End News
router.get("/news/categories/back", isLoggedIn, (req, res) => {
  News.find({ category: "Backend" })
    .then((result) => {
      console.log(result);
      res.render("news/categories/back",  {result});
    })
    .catch((err) => console.log("error getting Backend news", err));
});
///Front End News
router.get("/news/categories/front", isLoggedIn, (req, res) => {
  News.find({ category: "Frontend" })
    .then((result) => {
      console.log(result);
      res.render("news/categories/front", {result});
    })
    .catch((err) => console.log("error getting front end news", err));
});

module.exports = router;
