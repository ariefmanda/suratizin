function checkSession(req, res, next) {
  req.session.isLogin=true
  req.session.user={
    id:1,
    name:"Superadmin",
    role:0
  }
  if (req.session.isLogin) {
    res.locals.userSession = req.session.user
    if(req.originalUrl=='/admin'&&req.session.user.role>1){
      res.redirect('/user')
    }else{
      next(res.path)
    }
  } else {
    res.locals.userSession = null
    let pathLogin = (req.originalUrl == '/admin') ? '/admin/login' : '/login'
    console.log(req.originalUrl);
    res.redirect(pathLogin)
  }
}

module.exports = {
  checkSession: checkSession,
};
