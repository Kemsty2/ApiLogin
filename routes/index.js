import express from "express";
import passport from "passport";
import { verifyToken } from "../config/utils";

let router;
router = express.Router();

/*
 * @summary:
 * @params:
 * @result:
 * */

router.get('/login', (req, res) => {
  res.render('login', {
    title: "Login"
  })
});

router.get('/register', (req, res) => {
  res.render('register', {
    title: "Register"
  })
});

router.post('/register', (req, res, next) => {
  passport.authenticate('register', async (err, user, info) => {
    try {
      const body = req.body;
      const platformName = body.platformName;
      const token = body.token;
      const requestUI = body.requestUI;
      const error = req.flash('registerMessage')[0];

      if (await verifyToken(token)) {
        if (err) {
          console.log(err);
          return res.json({ ...error });
        }
        if (requestUI) {
          return res.redirect('/register');
        } else {
          if (user) {
            console.log(user);
            return res.json({
              result: true,
              user: user
            });
          } else {
            return res.json({ ...error });
          }
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
      let requestUI, platformName, token = "";
      const body = req.body;
      if (body.credentials) {
        requestUI = body.credentials.requestUI;
        platformName = body.credentials.platformName;
        token = body.credentials.token;
      }

      const error = req.flash('loginMessage')[0];
      console.log(await verifyToken(token));
      if (await verifyToken(token)) {
        if (err) {
          console.log(err);
          res.json({ ...error });
        }
        if (requestUI) {
          return res.redirect('/login');
        } else {
          console.log(user);
          if (user) {
            return res.json({
              result: true,
              user: user
            })
          } else {
            return res.json({ ...error });
          }
        }
      } else {
        res.json({
          error: "Don't have Access To This API"
        });
      }
    } catch (error) {
      console.error(error);
      res.redirect('/login');
    }
  })(req, res, next);
});

module.exports = router;
