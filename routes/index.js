import express from "express";
import passport from "passport";

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
  passport.authenticate('register', (err, user, info) => {
    try {
      const body = req.body;
      const platformName = body.platformName;
      const token = body.token;
      const requestUI = body.requestUI;
      const error = req.flash('registerMessage')[0];

      if (err) {
        console.log(err);
        return res.redirect('/registerFailure');
      }
      if (requestUI) {
        return res.redirect('/register');
      }
      if (user) {
        console.log(user);
        return res.json({
          result: true,
          user: user
        });
      } else {
        return res.json({...error});
      }
    } catch (error) {
      console.error(error);
      res.redirect('/register');
    }
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    try {
      let requestUI, platformName, token;
      const body = req.body;
      if (body.credentials) {
        requestUI = body.credentials.requestUI;
        platformName = body.credentials.platformName;
        token = body.credentials.token;
      }

      const error = req.flash('loginMessage')[0];

      if (err) {
        console.log(err);
        res.json({...error});
      }
      if (requestUI) {
        return res.redirect('/login');
      }
      console.log(user);
      if (user) {
        return res.json({
          result: true,
          user: user
        })
      } else {
        return res.json({...error});
        });
      }
    } catch (error) {
      console.error(error);
      res.redirect('/login');
    }
  })(req, res, next);
});

/* router.get('/loginSuccess', (req, res) => {
  const user = req.user;
  const result = {
    result: true,
    user: user
  };
  res.json(result);
});

router.get('/loginFailure', (req, res) => {
  const error = req.flash('loginMessage')[0];
  res.json(error);
});

router.get('/registerSuccess', (req, res) => {
  const user = req.user;
  const result = {
    result: true,
    user: user
  };
  res.json(result);
});

router.get('/registerFailure', (req, res) => {
  console.log(req.user);
  const error = req.flash('registerMessage')[0];
  res.json(error);
}); */

module.exports = router;
