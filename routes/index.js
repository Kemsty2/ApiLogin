import express from "express";
import passport from "passport";
import {
  verifyToken
} from "../config/utils";
import models from "../models";

let router;
router = express.Router();
const User = user(models.sequelize, models.Sequelize);

/*
 * @summary: "Rediriger le developppeur vers son redirectUrl"
 * @params: String redirectUrl=req.session.redirectUrl, String matricule=req.session.userMatricule
 * @result: Une page html pour rediriger le développeur vers sa page de redirection avec le matricule de l'utilisateur
 * */
router.get('/redirect', (req, res) => {  
  res.render('redirect', {redirectUrl: req.session.redirectUrl, matricule: req.session.userMatricule, layout:null});
});

/*
 * @summary: "Récupérer les informations de l'utilisateur"
 * @params: {platformName, token}
 * @result: {user, result} or {result, error}
 * */
router.post('/getUser', (req, res) => {
  try {
    const platformName = body.platformName;
    const token = body.token;
    const matricule = body.matricule;

    verifyToken(token).then(result => {
      if(result){
        User.findOne({
          where: {
            matricule: matricule
          }
        }).then(user => {
          if(user){
            const userinfo = user.get();
            //delete userinfo.password;
            res.json({
              result: true,
              user: userinfo
            });
          }else{
            res.json({
              result: false,
              error: "Don't find user with matricule " + matricule
            })
          }
        }).catch(err => {
          console.error(err);
        })
      }else{
        res.json({
          result: false,
          error: "Don't have Access To This API"
        })
      }
    }).catch(error => {
      console.error(error);
      res.json({
        result: false,
        error: "An error occurred when processing"
      })
    })
  } catch (error) {
    console.error(error);
    res.json({
      result: false,
      error: "An error occurred when processing"
    })
  }
});

/*
 * @summary: "Get Endpoint pour récuperer la page login"
 * @params: "http://localhost:{PORT}/login?token={token}&redirectUrl={redirectUrl}"
 * @result: "La page html du login"
 * */
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

/*
 * @summary: "Get Endpoint pour récuperer la page register"
 * @params: "http://localhost:{PORT}/register?token={token}&redirectUrl={redirectUrl}"
 * @result: "La page html du register"
 * */
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

/*
 * @summary: "Post Endpoint pour traiter les formulaires de register d'un utilisateur"
 * @params: Session: {token, redirectUrl, platformName} ou {platformName, token, redirectUrl, user}
 * @result: {result, user} or {result, error}
 * */
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

      if (await verifyToken(req.session.token)) {
        if (err) {
          console.log(err);
          return res.json({ ...error,
            redirectUrl: req.session.redirectUrl
          });
        }
        if (user) {
          //delete user.password;
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

/*
 * @summary: "Post Endpoint pour traiter les formulaires de login d'un utilisateur"
 * @params: Session: {token, redirectUrl, platformName} ou {credentials: {platformName, token, redirectUrl}, user: user}
 * @result: {result, user} or {result, error}
 * */
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
        //delete user.password;
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