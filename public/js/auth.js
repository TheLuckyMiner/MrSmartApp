/*Анимация регистрации и авторизации*/
let loginForm = document.getElementById('login');
let registerForm = document.getElementById('register');
let btnForm = document.getElementById('auth__btn-bg');

function register() {
   loginForm.style.left = "-400px";
   registerForm.style.left = "50px";
   btnForm.style.left = "110px";
}

function login() {
   loginForm.style.left = "50px";
   registerForm.style.left = "450px";
   btnForm.style.left = "0";
}