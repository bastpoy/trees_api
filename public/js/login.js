import { fetchLoginData } from "./featuresfunction/fetch.js";

//je récupère mes données de formulaire
export const dataForm = function (form) {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let data = {
      email: form.elements["input_email"].value,
      password: form.elements["input_password"].value,
    };
    console.log(data);
    fetchLoginData(data);
  });
};
