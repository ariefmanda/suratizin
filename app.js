const ejs           = require('ejs')
const express       = require('express')
const favicon       = require('express-favicon')
const session       = require('express-session')
const bodyParser    = require('body-parser')
const multer        = require('multer')
const Model         = require('./models')
const app           = express()
const port          = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('view cache', false)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use('/public', express.static(process.cwd() + '/public'))
app.use('/public', express.static(__dirname + '/public'))
app.use(favicon(__dirname + '/public/assets/img/favicon.ico'))
app.use(session({ secret: 'surat-izin-2017', cookie: { maxAge: 3600000 } })) //3600000

// app.use('/login', require('./routes/login'))
// app.use('/logout', require('./routes/logout'))
// app.use('/reset', require('./routes/reset'))
// app.use('/reset/:token', require('./routes/reset'))

// app.use((req, res, next) => {
//   res.locals.userSession = req.session.user
//   next()
// })

// app.use('/', authSession.checkSession, require('./routes/index'))
app.use('/', require('./routes/index'))

app.listen(port, () => console.log(`Sundul gan on http://localhost:${port} !!`))
