import express from "express";
import passport from "passport";
import {
  verifyToken
} from "../config/utils";

let router;
router = express.Router();

/*
 * @summary:
 * @params:
 * @result:
 * */

router.get('/redirect', (req, res) => {  
  res.render('redirect', {redirectUrl: req.session.redirectUrl, matricule: req.session.userMatricule, layout:null});
});

router.get('/login', async (req, res) => {
  const token = req.query.token;
  const redirectUrl = req.query.redirectUrl;

  req.session.token = token;
  req.session.redirectUrl = redirectUrl;
  req.session.requestUI = true;
  if (await verifyToken(token)) {
    res.render('login', {
      title: "Login"
    });
  } else {
    res.json({
      error: "Don't have Access To This API",
      redirectUrl: redirectUrl
    });
  }
});

router.get('/register', async (req, res) => {
  const token = req.query.token;
  const redirectUrl = req.query.redirectUrl;

  req.session.token = token;
  req.session.redirectUrl = redirectUrl;
  req.session.requestUI = true;
  if (await verifyToken(token)) {
    res.render('register', {
      title: "Register"
    });
  } else {
    res.json({
      error: "Don't have Access To This API",
      redirectUrl: redirectUrl
    });
  }
});

router.post('/register', (req, res, next) => {
  passport.authenticate('register', async (err, user, info) => {
    try {
      const body = req.body;
      const platformName = body.platformName;
      const token = body.token;
      const redirectUrl = body.redirectUrl;
      const error = req.flash('registerMessage')[0];
      const requestUI = req.session.requestUI;

      !req.session.token ? req.session.token = token : null;
      !req.session.redirectUrl ? req.session.redirectUrl = redirectUrl : null;

      if (await verifyToken(token)) {
        if (err) {
          console.log(err);
          return res.json({ ...error,
            redirectUrl: req.session.redirectUrl
          });
        }
        if (user) {
          delete user.password;
          console.log(user);
          if(requestUI){
            req.session.userMatricule = user.matricule;
            res.redirect('/redirect');
          }else{
            return res.json({
              result: true,
              user: user,
              redirectUrl: req.session.redirectUrl
            });
          }          
        } else {
          return res.json({ ...error,
            redirectUrl: req.session.redirectUrl
          });
        }
      } else {
        res.json({
          error: "Don't have Access To This API"
        });
      }
    } catch (error) {
      console.error(error);
      res.redirect('/register');
    }
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      let platformName, token,
        redirectUrl;
      const body = req.body;
      if (body.credentials) {
        platformName = body.credentials.platformName;
        token = body.credentials.token;
        redirectUrl = body.credentials.redirectUrl;        
      }else{
        token = req.session.token;
        redirectUrl = req.session.redirectUrl;
      }      
      if ((!token || !redirectUrl)) {
        return res.json({
          result: false,
          error: "Requête Mal Formée"
        });
      }
      const requestUI = req.session.requestUI;

      const error = req.flash('loginMessage')[0];
      console.log(await verifyToken(token));
      if (await verifyToken(token)) {
        if (err) {
          console.log(err);
          res.json({ ...error,
            redirectUrl: redirectUrl
          });
        }
        delete user.password;
        if (user) {
          if(requestUI){
            req.session.userMatricule = user.matricule;
            res.redirect('/redirect');
          }else{
            return res.json({
              result: true,
              user: user,
              redirectUrl: redirectUrl
            });
          }          
        } else {
          return res.json({ ...error,
            redirectUrl: redirectUrl
          });
        }
      } else {
        res.json({
          error: "Don't have Access To This API",
          redirectUrl: redirectUrl
        });
      }
    } catch (error) {
      console.error(error);
      res.redirect('/login');
    }
  })(req, res, next);
});

module.exports = router;