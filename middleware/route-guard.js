const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect('/login');
    }
    next();
  };
    
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };

  const isAdmin=(req,res, next)=>{
    if(req.session.currentUser.admin === false){
      return res.redirect('/');
    
    }
    next();
  };
  
  module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin,
  };