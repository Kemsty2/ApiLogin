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
	res.render('login', {title: "Login"})
});

router.get('/register', (req, res) => {
	res.render('register', {title: "Register"})
});

router.post('/login', (req, res) => {
	const body = req.body;
	let requestUI = body.requestUI;
	console.log(requestUI);
	if (requestUI) {
		return res.redirect('/login');
	}
	passport.authenticate('login', null, null)(req, res, function () {
		console.log(req.user);
		console.log(req.flash('loginMessage'));
	});
});

router.post('/loginUI',  passport.authenticate('login', {
	successRedirect: '/loginSuccess',
	failureRedirect: '/loginFailure',
	failureFlash: true
},null));

router.post('/register',  passport.authenticate('login', {
	successRedirect: '/registerSuccess',
	failureRedirect: '/registerFailure',
	failureFlash: true
},null));

router.get('/loginSuccess', (req, res) => {
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
});

module.exports = router;
