const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const container = document.getElementById('container');

signUp.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signIn.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// const signUpUsername = document.getElementById('signUpUsername');
// const signUpPassword = document.getElementById('signUpPassword');

// const signUpButton = document.getElementById('signUpButton');

// signUpButton.addEventListener('click', () => {
// 	// Sanitize
// 	var cleanSignUpUsername = DOMPurify.sanitize(signUpUsername.value, {SAFE_FOR_TEMPLATES: true})
// 	var cleanSignUpPassword = DOMPurify.sanitize(signUpPassword.value, {SAFE_FOR_TEMPLATES: true});
// });
	
// const signInUsername = document.getElementById('signInUsername');
// const signInPassword = document.getElementById('signInPassword');

// const signInButton = document.getElementById('signInButton')

// signInButton.addEventListener('click', () => {
// 	// Sanitize
// 	var cleanSignInUsername = DOMPurify.sanitize(signInUsername.value, {SAFE_FOR_TEMPLATES: true})
// 	var cleanSignInPassword = DOMPurify.sanitize(signInPassword.value, {SAFE_FOR_TEMPLATES: true});
// });
	
// module.exports.cleanSignUpUsername = cleanSignUpUsername;
// module.exports.cleanSignUpPassword = cleanSignUpPassword;
// module.exports.cleanSignInUsername = cleanSignInUsername;
// module.exports.cleanSignInPassword = cleanSignInPassword;
