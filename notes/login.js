async const autoLogin = () => {

}




document.getElementById('identifierId').value = "email";
document.getElementById('identifierNext').click();

document.getElementsByName('password')[0].value() = "pwd";
document.getElementById('passwordNext').click();

var promise = new Promise(function(resolve, reject) {
    // do a thing, possibly async, then…
  
    if (true) {
      resolve("Stuff worked!");
    }
    else {
      reject(Error("It broke"));
    }
  });

  window.setInterval(function(){ // Set interval for checking
    var date = new Date(); // Create a Date object to find out what time it is
    if(date.getHours() == 11 && date.getMinutes() == 42){ // Check the time
        console.log(date.getHours(),date.getMinutes())
        console.log(date)
    }
    console.log(date.getHours(),date.getMinutes())
}, 500); // Repeat every 60000 milliseconds (1 minute)