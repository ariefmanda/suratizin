function checkSession(req, res, next) {
  // console.log('====', req.originalUrl);
  if (req.session.isLogin) {
    next(res.path)
  } else {
    // let pathLogin = (req.originalUrl == '/admin') ? '/admin/login' : '/login'
    // console.log('===', pathLogin);
    res.redirect('/admin/login')
  }
}

module.exports = {
  checkSession: checkSession,
};
