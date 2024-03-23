let body = document.body;
let sideBar = document.querySelector('.side-bar');
let header = document.querySelector('.header');
let main = document.querySelector('.main');

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('bar-disabled');
   header.classList.toggle('main-disabled');
   main.classList.toggle('main-disabled');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.remove('bar-disabled');
   header.classList.remove('main-disabled');
   main.classList.remove('main-disabled');
//    body.classList.remove('active');
}
