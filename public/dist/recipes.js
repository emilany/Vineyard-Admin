// Initialize Firebase
var config = {
  apiKey: "AIzaSyCEAohW7E2BPdYmXos7rJeszF5STZD_5GQ",
  authDomain: "vineyard-f7e80.firebaseapp.com",
  databaseURL: "https://vineyard-f7e80.firebaseio.com",
  storageBucket: "vineyard-f7e80.appspot.com",
  messagingSenderId: "558097717869"
};
firebase.initializeApp(config);

function loadRecipeFile() {
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
    var now = new Date();
    var currdate = new Date();
    var id = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
    var snackbar = document.getElementById('success-snackbar');
    var ing = [];
    var dir = [];

    for(x = 0; x < actual_JSON.length; x++){
        var recipeID = id+""+x;
        var direction = "";
        var ingredient = "";

        var description = actual_JSON[x].description;
        var ingrSize = actual_JSON[x].ingredients.length;
        var url = actual_JSON[x].url;

      if(url != "//ajax.googleapis.com" || ingrSize != 0){
        if(description == null || description == ""){
          description = " ";
        }

        firebase.database().ref('recipes/'+recipeID).set({
          url: actual_JSON[x].url,
          title: actual_JSON[x].title,
          image_url: actual_JSON[x].image,
          description: description
        });

        //timestamp
        firebase.database().ref('time_Stamps/'+recipeID).set({
          date_time_stamp_created: currdate.toString()
        });

        //direction
        for(y = 0; y < actual_JSON[x].directions.length; y++){
          var temp = actual_JSON[x].directions[y]+"|";
          direction = direction.concat(temp);
        }
        firebase.database().ref('contents_Directions/'+recipeID).update({
          directions: direction
        });
       
        //ingredient
        for(z = 0; z < actual_JSON[x].ingredients.length; z++){
          var temp = actual_JSON[x].ingredients[z]+"|";
          ingredient = ingredient.concat(temp);
        }
        firebase.database().ref('contents_Ingredients/'+recipeID).update({
          ingredients: ingredient
        });
      }        
    }

    var data = {message: 'Successfully added recipes to database.'};
    snackbar.MaterialSnackbar.showSnackbar(data);
    document.getElementById("fileinput").value="";
  }
}

function deleteRecipesDB(){
  var snackbar = document.getElementById('success-snackbar');
  var recipeRef = firebase.database().ref('recipes');
  var contentIngredientsRef = firebase.database().ref('contents_Ingredients');
  var contentDirectionsRef = firebase.database().ref('contents_Directions');
  recipeRef.remove();
  contentIngredientsRef.remove();
  contentDirectionsRef.remove();
  dialog.close();
  var data = {message: 'Successfully deleted recipes from database.'};
  snackbar.MaterialSnackbar.showSnackbar(data);
  console.log('Successfully deleted recipes from database.');
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
  if(firebaseUser){
    document.getElementById('userEmail').innerHTML = firebaseUser.email;
  }else {
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