const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy;

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ 
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  // cookie: { maxAge: 60 } <--- こいつを入れるとやばい!!
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy((username, password, done) => {
  if (username !== 'user' || password !== 'passwd') {
    return
  }
  return done(null, username)
}))

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, 'public') })
})

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login/ng', session: true }),
  (req, res) => {
    res.redirect('/login/ok')
  }
)

app.get('/login/ng', (req, res) => {
  res.sendFile('ng.html', { root: path.join(__dirname, 'public') })
})

app.get('/login/ok', 
require('connect-ensure-login').ensureLoggedIn('/login'), // <---
(req, res) => {
  res.sendFile('ok.html', { root: path.join(__dirname, 'public') })
});

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

app.listen(3000, () => {
  console.log('Listening on prot 3000')
})

// 参考: https://github.com/passport/express-4.x-local-example/blob/master/server.js