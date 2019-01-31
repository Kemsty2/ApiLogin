(function ($) {
	"use strict";


	/*==================================================================
	[ Focus input ]*/
	$('.input100').each(function () {
		$(this).on('blur', function () {
			if ($(this).val().trim() !== "") {
				$(this).addClass('has-val');
			} else {
				$(this).removeClass('has-val');
			}
		});
		if ($(this).val().trim() !== 0) {
			$(this).addClass('has-val')
		} else {
			$(this).addClass('has-val')
		}
	});


	/*==================================================================
	[ Validate ]*/
	const input = $('.validate-input .input100');

	$('.validate-form-login').on('submit', function () {
		let check = true;

		for (let i = 0; i < input.length; i++) {
			if (validate(input[i]) === false) {
				showValidate(input[i]);
				check = false;
			}
		}
		console.log(check);
		return check;
	});

	$('.validate-form-register').on('submit', function () {
		let check = true;
		const pass = $('#password');
		const confirm_pass = $('#confirmPassword');
		const userType = $('#js-switch');
		const userTypeField = $('#userType');

		for (let i = 0; i < input.length; i++) {
			if (validate(input[i]) === false) {
				showValidate(input[i]);
				check = false;
			}
		}
		if(pass && confirm_pass){
			if(pass.val().trim() !== confirm_pass.val().trim()){
				pass.parent().attr('data-validate', 'Les mots de passes ne correspondent pas');
				confirm_pass.parent().attr('data-validate', 'Les mots de passes ne correspondent pas');
				showValidate(pass);
				showValidate(confirm_pass);
				check = false
			}
		}
		if(userType[0].checked){
			userTypeField.val('1')
		}else{
			userTypeField.val('0')
		}
		return check;
	});


	$('.validate-form .input100').each(function () {
		$(this).focus(function () {
			hideValidate(this);
		});
	});

	function validate(input) {
		if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
			if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
				return false;
			}
		} else {
			if ($(input).val().trim() === '') {
				return false;
			}
		}
	}

	function showValidate(input) {
		const thisAlert = $(input).parent();

		$(thisAlert).addClass('alert-validate');
	}

	function hideValidate(input) {
		const thisAlert = $(input).parent();

		$(thisAlert).removeClass('alert-validate');
	}

	/*==================================================================
	[ Show pass ]*/
	let showPass = 0;
	$('.btn-show-pass').on('click', function () {
		if (showPass === 0) {
			$(this).next('input').attr('type', 'text');
			$(this).find('i').removeClass('zmdi-eye');
			$(this).find('i').addClass('zmdi-eye-off');
			$(this).toggleClass('active');
			showPass = 1;
		} else {
			$(this).next('input').attr('type', 'password');
			$(this).find('i').addClass('zmdi-eye');
			$(this).find('i').removeClass('zmdi-eye-off');
			$(this).toggleClass('active');
			showPass = 0;
		}
	});
	const userTypeField = document.getElementById('userType')
	const userType = document.querySelector('.js-switch');
	const options = {
		color: '#ff6d00'
		, secondaryColor: '#eee'
		, jackColor: '#fff'
		, jackSecondaryColor: '#eee'
		, className: 'switchery'
		, disabled: false
		, disabledOpacity: 0.5
		, speed: '0.3s'
		, size: 'small'
	};
	if (userType) {
		new Switchery(userType, options);

		userType.onChange = () => {
			let type = 0;
			if (userType.checked) {
				type = 1;
			}
			console.log(type);
			userTypeField.value = type;
		};
	}
})(jQuery);


