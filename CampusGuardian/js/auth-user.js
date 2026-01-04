// USER AUTH (Student side)
// simple localStorage based for project demo

const USER_KEY = "cg_user_email";

function userIsLogged(){
  return localStorage.getItem(USER_KEY) !== null;
}

function requireUser(){
  if(!userIsLogged()){
    window.location.href = "login.html";
  }
}

function getUserEmail(){
  return localStorage.getItem(USER_KEY);
}

function userLogin(email){
  localStorage.setItem(USER_KEY,email);
}

function userLogout(){
  localStorage.removeItem(USER_KEY);
  window.location.href = "login.html"; // ✅ FIXED
}
