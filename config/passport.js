import bcrypt from "bcrypt-nodejs";
import passport from "passport";
const LocalStrategy = require('passport-local').Strategy;
import user from "../models/iauser";
import models from "../models";
import {
  verifyToken
} from "./utils";

const User = user(models.sequelize, models.Sequelize);

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const isValidPassword = (userpass, password) => {
  return bcrypt.compareSync(password, userpass);
};

passport.serializeUser((user, cb) => {
  cb(null, user.matricule)
});

passport.deserializeUser((matricule, done) => {
  //Find User and Call cb(err, user);
  User.findOne({
    where: {
      matricule: matricule
    }
  }).then(user => {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  }).catch(err => {
    console.error(err);
  });
});

/*
@params: body_request : {
    credentials: {
      platformName: "",
      requestUi: true,
      token: ""
    },
    email: "",
    password: ""
  }
*@result: {result: false, error: value}
*/
passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, passport, done) => {
  console.log(req.session.token);
  verifyToken(req.session.token).then(result => {
    if (result) {
      User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (user) {
          return done(null, false, req.flash('registerMessage', {
            result: false,
            error: '11'
          }));
        } else {
          const userPassword = generateHash(passport);
          const userData = {
            email: email,
            password: userPassword,
            matricule: req.body.matricule,
            userName: req.body.userName,
            userType: req.body.userType
          };
          User.create(userData).then((newUser) => {
            if (!newUser) {
              return done(null, false, req.flash('registerMessage', {
                result: false,
                error: '10'
              }));
            } else {
              return done(null, newUser)
            }
          }).catch(err => {
            return done(null, false, req.flash('registerMessage', {
              result: false,
              error: '10'
            }));
          })
        }
      }).catch(err => {
        console.log('Error', err);
        return done(null, false, req.flash('registerMessage', {
          result: false,
          error: '10'
        }));
      })
    } else {
      return done(null, false);
    }
  }).catch(error => {
    console.error(error);
    return done(null, false, req.flash('registerMessage', {
      result: false,
      error: '10'
    }));
  });
}));

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, passport, done) => {
  console.log(req.session.token);
  verifyToken(req.session.token).then(result => {
    if (result) {
      User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (!user) {
          return done(null, false, req.flash('loginMessage', {
            result: false,
            error: '01'
          }));
        }
        if (!isValidPassword(user.password, passport)) {
          return done(null, false, req.flash('loginMessage', {
            result: false,
            error: '02'
          }));
        }

        const userInfo = user.get();
        return done(null, userInfo);
      }).catch(err => {
        console.log('Error', err);
        return done(null, false, req.flash('loginMessage', {
          result: false,
          error: '00'
        }));
      })
    } else {
      return done(null, false);
    }
  }).catch(error => {
    console.log('Error', error);
    return done(null, false, req.flash('loginMessage', {
      result: false,
      error: '00'
    }));
  });
}));