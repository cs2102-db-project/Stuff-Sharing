function check(event) {
	// Get Values
	var name  = document.getElementById('name' ).value;
	var username    = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	// Simple Check
	if(name.length == 0) {
		alert("Invalid name");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(username.length == 0) {
		alert("Invalid username");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(password.length == 0) {
		alert("Invalid password");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}