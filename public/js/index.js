import { dataForm } from "./login.js";

//DOM INTERACTION
const loginForm = document.querySelector(".login_form");

//si je clique sur signup je renvois vers la page signup
document.addEventListener("click", (ev) => {
  if (ev.target.className === "signup_button") {
    window.setTimeout(() => {
      location.assign("/signupForm");
    }, 1000);
  }
});

if (loginForm) {
  dataForm(loginForm);
}
