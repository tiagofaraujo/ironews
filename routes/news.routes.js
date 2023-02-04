const router = require("express").Router();
const News = require("../models/News.model");
const {isLoggedIn,isAdmin} = require("../middleware/route-guard");

const fileUploader = require('../config/cloudinary.config');

//all news articles

router.get("/news", isLoggedIn, (req, res, next) => {
    News.find()
      .then((news) => {
        console.log(news);
        res.render("news/news", { news:news , userInSession: req.session.currentUser });
    
      })
      .catch((err) => console.log("error getting news articles", err));
  });


//POST for create
const categoryArray = ["latest", "world", "you might also like", "back", "front"]

router.get("/news/create", isLoggedIn, (req,res, next)=>{

  res.render("news/create-news", {categoryArray});

})

//fileUploader.single('news-image'),

router.post("/news/create", isLoggedIn,(req, res) => {
    console.log(req.body);
     const { title, category, image, content, owner} = req.body;
     console.log(req.file)
     //console.log(req.file.path)
     //req.file
     News.create({
       title: title,
       category: category,
       image: image, //req.file.path,
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
});



//POST for edit
router.get("/news/:newsId/edit", isLoggedIn, isAdmin,(req, res) => {
  const { newsId } = req.params;
  News.findById(newsId)
  .then((newsToEdit) => {
      res.render("news/edit-news", {news:newsToEdit, categoryArray});
  })
  .catch((err) => console.log("error getting news articles to edit", err));
});

  router.post('/news/:newsId/edit',isLoggedIn, isAdmin,(req, res, next) => {
    const { newsId } = req.params;
    const { title, category, image, content} = req.body;
   
   News.findByIdAndUpdate(newsId, {  
      title: title,
      category: category,
      image: image,
      content: content}, { new: true })
      .then(() =>{
        res.redirect(`/news/${newsId}`) // go to the details page to see the updates
      } )
      .catch(error => next(error));
  });
   
//Details route
  router.get('/news/:newsId',isLoggedIn,(req,res)=>{
    const { newsId } = req.params;
    News.findById(newsId)
    .populate('content')
    .then((result)=>{
        console.log(result)
       res.render('news/news-details',result)
    })
    .catch((err) => console.log("error getting news-details", err));
  })

  //POST for delete
router.post("/news/:newsId/delete",isLoggedIn,isAdmin, (req, res) => {
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
  ///Latest News
  router.get('/news/categories/latest',isLoggedIn,(req,res)=>{
    News.find()
       .then((result)=>{
        console.log(result)
       res.render('news/categories/latest',{news:result.reverse()})
    })
    .catch((err) => console.log("error getting latest news", err));
  })
    ///World News
    router.get('/news/categories/world',isLoggedIn,(req,res)=>{
           News.find({category: "world"})
         .then((result)=>{
          console.log(result)
         res.render('news/categories/world',{news:result})
      })
      .catch((err) => console.log("error getting world news", err));
    })
///You might also like
router.get('/news/categories/might-like',isLoggedIn,(req,res)=>{
  News.find({category: "you might also like"})
     .then((result)=>{
      console.log(result)
     res.render('news/categories/might-like',result)
  })
  .catch((err) => console.log("error getting you might also like news", err));
})

///Back End News
router.get('/news/categories/back',isLoggedIn,(req,res)=>{
  News.find({category: "back"})
     .then((result)=>{
      console.log(result)
     res.render('news/categories/back',result)
  })
  .catch((err) => console.log("error getting back end news", err));
})
///Front End News
router.get('/news/categories/front',isLoggedIn,(req,res)=>{
  News.find({category: "front"})
     .then((result)=>{
      console.log(result)
     res.render('news/categories/front',result)
  })
  .catch((err) => console.log("error getting front end news", err));
})

  module.exports = router;