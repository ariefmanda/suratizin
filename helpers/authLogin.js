function checkSession(req, res, next) {
  if (req.session.isLogin) {
    res.locals.userSession = req.session.user
    next(res.path)
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
