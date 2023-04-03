import { postSignup } from "./featuresfunction/fetch.js";

const signupForm = document.querySelector(".signup_form");

document.addEventListener("submit", (ev) => {
  ev.preventDefault();
  let data = {
    name: signupForm.elements["input_username"].value,
    email: signupForm.elements["input_email"].value,
    password: signupForm.elements["input_password"].value,
    passwordConfirm: signupForm.elements["input_confirmPassword"].value,
  };
  postSignup(data);
});
