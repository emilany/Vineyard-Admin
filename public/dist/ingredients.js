// Initialize Firebase
var config = {
  apiKey: "AIzaSyCEAohW7E2BPdYmXos7rJeszF5STZD_5GQ",
  authDomain: "vineyard-f7e80.firebaseapp.com",
  databaseURL: "https://vineyard-f7e80.firebaseio.com",
  storageBucket: "vineyard-f7e80.appspot.com",
  messagingSenderId: "558097717869"
};
firebase.initializeApp(config);

function loadIngredientFile() {
  var input, file, fr;
  var snackbar = document.getElementById('success-snackbar');

  if (typeof window.FileReader !== 'function') {
    var data = {message: 'The file API is not supported in this browser.'};
    snackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    var data = {message: 'Could not find input element.'};
    snackbar.MaterialSnackbar.showSnackbar(data);
  }
  else if (!input.files) {
    var data = {message: 'This browser does not support files property of file inputs.'};
    snackbar.MaterialSnackbar.showSnackbar(data);
  }
  else if (!input.files[0]) {
    var data = {message: 'Select a file before clicking load.'};
    snackbar.MaterialSnackbar.showSnackbar(data);
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    lines = e.target.result;
    var actual_JSON = JSON.parse(lines);
    var x;
    var y;
    var z;
    var ingr = [];
    var now = new Date();
    var currdate = new Date();
    var id = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
    var snackbar = document.getElementById('success-snackbar');

    for(x = 0; x < actual_JSON.length; x++){
        var recipeID = id+""+x; 
        firebase.database().ref('ingredients/' + recipeID).set({
            ingredient: actual_JSON[x].ingredient
        });
    }

    for(x = 0; x < actual_JSON.length; x++){
        ingr.push(actual_JSON[x]);
    }

    var data = {message: 'Successfully added ingredients to database.'};
    snackbar.MaterialSnackbar.showSnackbar(data);
    document.getElementById("fileinput").value="";
  }
}

function deleteIngredientsDB(){
  var snackbar = document.getElementById('success-snackbar');
  var ref = firebase.database().ref('ingredients');
  ref.remove();
  dialog.close();
  var data = {message: 'Successfully deleted ingredients from database.'};
  snackbar.MaterialSnackbar.showSnackbar(data);
  console.log('Successfully deleted ingredients from database.');
}

var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#view-source');
if (! dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function() {
  dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function() {
  dialog.close();
});

//user email for sidebar
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    document.getElementById('userEmail').innerHTML = firebaseUser.email;
  } else {
    console.log('not logged in');
    window.location.replace("https://vineyard-f7e80.firebaseapp.com/");
  }
})

//logout
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click', e => {
  if (firebase.auth().signOut()) {
    window.location.replace("https://vineyard-f7e80.firebaseapp.com/");
  }
})
