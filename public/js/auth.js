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

function showPassword1(){
   const btn = document.getElementById('password__btn1');
   const input = document.getElementById('password__input1');

   btn.addEventListener('click', () => {
       btn.classList.toggle('active');
        if(input.getAttribute('type') === 'password'){
           input.setAttribute('type', 'text');
        } else{
           input.setAttribute('type', 'password');
        }
   })
}

function showPassword2(){
   const btn = document.getElementById('password__btn2');
   const input = document.getElementById('password__input2');
   const input2 = document.getElementById('password__input3');

   btn.addEventListener('click', () => {
       btn.classList.toggle('active');
        if(input.getAttribute('type') === 'password'){
           input.setAttribute('type', 'text');
           input2.setAttribute('type', 'text');
        } else{
           input.setAttribute('type', 'password');
           input2.setAttribute('type', 'password');
        }
   })
}

showPassword1();
showPassword2();
