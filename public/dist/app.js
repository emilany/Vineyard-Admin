// Initialize Firebase
var config = {
    apiKey: "AIzaSyCEAohW7E2BPdYmXos7rJeszF5STZD_5GQ",
    authDomain: "vineyard-f7e80.firebaseapp.com",
    databaseURL: "https://vineyard-f7e80.firebaseio.com",
    storageBucket: "vineyard-f7e80.appspot.com",
    messagingSenderId: "558097717869"
};
firebase.initializeApp(config);

// Get elements
const txtEmail = document.getElementById('email');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('login');
const message = document.getElementById('alert');

//user email for sidebar
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser){
    window.location.replace("../recipes.html");
  }else {
    console.log('not logged in');
  }
})

//Add login event
btnLogin.addEventListener('click', e => {
	//Get email and pw
	const email = txtEmail.value;
	const password = txtPassword.value;
    var snackbar = document.getElementById('success-snackbar');

	//Sign in
    if(email && password){
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        window.location.replace("recipes.html");
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        var data = {message: errorMessage};
        snackbar.MaterialSnackbar.showSnackbar(data);
      });
    }else{
        var data = {message: 'Please provide input.'};
        snackbar.MaterialSnackbar.showSnackbar(data);
    }
});
