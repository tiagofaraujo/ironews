const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require("mongoose");
const { isLoggedIn, isAdmin } = require("../middleware/route-guard.js");

//////////// L O G I N ///////////
// GET route ==> to display the login form to users
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// POST login route ==> to process form data
router.post("/signup", (req, res, next) => {
// console.log("the form data", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Please fill in all mandatory fields. Email and Password are required",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", {
      errorMessage:
        "Please input a password: at least 6 characters long, with a lowercase and uppercase letter",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    })
    .then((hashedPassword) => {
    //  console.log("Hasted Password", hashedPassword);
    //  console.log("Password", password);
     // console.log("email ", email);
      return User.create({
        email: email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
    //  console.log("Newly created user is: ", userFromDB);
      res.redirect("/news");
    })
    .catch((error) => {
      console.error(error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.render("auth/signup", {
          errorMessage:
            "There is already an account associated with this email. Please sign in or sign up with new email.",
        });
      } else {
        next(error);
      }
    });
});

router.get("/login", (req, res) => {
 // console.log(req.session);
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res) => {
 // console.log("user:", req.session.currentUser);
  res.render("index", { userInSession: req.session.currentUser });
});

router.post("/login", (req, res) => {
 // console.log("SESSION =====>", req.session);
//  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("index", {
      errorMessage: "please enter an email or password",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      const { username, email, admin, _id } = user;
    //  console.log(email);
      if (!user) {
        res.render("index", {
          errorMessage:
            "User not found please sign up. No account associated with email",
        });
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = { username, email, admin, _id };
        res.redirect("/news");
      } else {
        res.render("index", { errorMessage: "Incorrect Password" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

//Get the About Page
router.get("/about", (req, res) => {
res.render("about");
});

/* 
//ALL Users (Admin Panel)
router.get("/profile", isLoggedIn, isAdmin, (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("user/user-profile", {
        users: users,
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => console.log("error getting users list", err));
}) */

module.exports = router;
