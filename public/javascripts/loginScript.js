const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

/*
var signUpName = document.getElementById('signUpName'),
	signUpEmail = document.getElementById('signUpEmail'),
	signUpPassword = document.getElementById('signUpPassword'),

    signUpButton = document.getElementById('signUpButton').addEventListener('click', function(){
      // Sanitize
	  var clean = DOMPurify.sanitize(signUpName.value, {SAFE_FOR_TEMPLATES: true}) + DOMPurify.sanitize(signUpEmail.value, {SAFE_FOR_TEMPLATES: true}) 
	  	+ DOMPurify.sanitize(signUpPassword.value, {SAFE_FOR_TEMPLATES: true});
      result.innerHTML = clean;
      console.log(clean);
	});
	
var signInEmail = document.getElementById('signInEmail'),
	signInPassword = document.getElementById('signInPassword'),

	signInButton = document.getElementById('signInButton').addEventListener('click', function(){
		// Sanitize
		var clean = DOMPurify.sanitize(signInEmail.value, {SAFE_FOR_TEMPLATES: true}) + DOMPurify.sanitize(signInPassword.value, {SAFE_FOR_TEMPLATES: true});
		result.innerHTML = clean;
		console.log(clean);
    });
*/