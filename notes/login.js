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

window.setInterval(function(){
    var date = new Date();
    if(date.getHours() == 9 && date.getMinutes() == 50){
      document.getElementsByName('login')[0].click();
    }
    console.log(date.getHours(),date.getMinutes())
}, 1000);


document.getElementsByName('password')[0].value() = "pwd";
document.getElementsByName('password')[0].value() = "pwd";
document.getElementsByName('login')[0].click();