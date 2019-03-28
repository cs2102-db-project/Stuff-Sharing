// function check(event) {
// 	// Get Values
// 	var username    = document.getElementById('username').value;
// 	var password = document.getElementById('password').value;
	
// 	// Simple Check
// 	if(username.length == 0) {
// 		alert("Invalid username");
// 		event.preventDefault();
// 		event.stopPropagation();
// 		return false;
// 	}
// 	if(password.length == 0) {
// 		alert("Invalid password");
// 		event.preventDefault();
// 		event.stopPropagation();
// 		return false;
// 	}
// }
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});