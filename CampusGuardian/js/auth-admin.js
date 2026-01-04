// Admin auth (demo)

const ADMIN_KEY = "cg_admin";
const ADMIN_USER = "admin@campus";  // demo
const ADMIN_PASS = "admin123";      // demo

function adminIsLogged(){
  return localStorage.getItem(ADMIN_KEY) !== null;
}

function requireAdmin(){
  if(!adminIsLogged()){
    window.location.href="../admin/login.html";
  }
}

function adminLogin(){
  localStorage.setItem(ADMIN_KEY,"true");
}

function adminLogout(){
  localStorage.removeItem(ADMIN_KEY);
  window.location.href="../admin/login.html";
}
