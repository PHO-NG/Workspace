require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook')
const findOrCreate = require('mongoose-findorcreate')


const app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

/* -- configurate session details -- */
app.use(session({
    secret: "Test Secret",
    resave: false,
    saveUninitialized: false
}))

/* -- initialise passport -- */
app.use(passport.initialize())
/* -- use passport to manage session -- */
app.use(passport.session())

mongoose.connect(process.env.DATABASE)
/* -- mongoose.set("useCreateIndex", true) --*/ 

const userSchema = new mongoose.Schema({
    // email: String,
    // password: String,
    // googleId: String,
    // facebookId: String,
    secret: String
})

/* -- initialise passportLocalMongoose -- */
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)

/* -- create session details: serialise-creates the cookie for user | deserialise-reads the cookie -- */
passport.use(User.createStrategy())
passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id,done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

/* -- 1. create google strategy which -- */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
    ,userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  /* -- 2. returns the profile of the user so we can store it in our DB -- */
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return cb(err, user);
    })
  }
))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ facebookId: profile.id }, (err, user) => {
      return cb(err, user);
    })
  }
))

app.get('/', (req,res) => {
    res.render('home') 
})

/* -- use passport to authenticate the user using google strategy and, return their profile-- */
app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

/* -- authenticate user locally. -- */
app.get('/auth/google/secrets', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
    res.redirect('/secrets')
})

/* -- use passport to authenticate the user using facebook strategy and, return their email-- */
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))

/* -- authenticate user locally. -- */
app.get('/auth/facebook/secrets', passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
    res.redirect('/secrets')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.get('/register', (req,res) => {
    res.render('register')
})

app.post('/login', (req,res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    /* -- https://www.passportjs.org/concepts/authentication/login/ -- */
    req.login(user, (err) => {
        if (err) { 
            console.log(err)
        } else {        
            /* -- authenticates user -- */
            passport.authenticate('local')(req,res, () => {
                res.redirect('/secrets')
            })
        }
    })
})

app.get('/secrets', (req,res) => {
    User.find({secret: {$ne: null}}, (err, results) => {
        if (!err) {
            if (results) {
                res.render('secrets', {userWithSecrets: results})
            }
        }
    })
})

app.post('/register', (req,res) => {
    /* -- passport-local-mongoose shortcut to add users -- */
    User.register({username: req.body.username}, req.body.password, (err,user) => {
        if (err) {
            console.log(err)
        } else {
            passport.authenticate('local')(req,res, () => {
                res.redirect('/secrets')
            })
        }
    })
})

app.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})


app.get('/submit', (req,res) => {
    if (req.isAuthenticated()) {
        res.render('submit')
    } else {
        res.redirect('/login')
    }
})

app.post('/submit', (req,res) => {
    const submittedSecret = req.body.secret
    User.findById(req.user.id, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                user.secret = submittedSecret;
                user.save(() => {
                    res.redirect('/secrets');
                });
            } 
        }
    });
});

app.listen(3000, () => {
    console.log("Server started!")
})

