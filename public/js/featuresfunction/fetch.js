import { showAlert } from "./alerts.js";
//je fetch la data qui permet de se connecter au site.
//elle est liée au formulaire
export const fetchLoginData = async function (dataArray) {
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataArray),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/user");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err);
  }
};
export const postSignup = async function (data) {
  try {
    const response = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }
    if (response.ok) {
      showAlert("success", "utilisateur crée avec succès");
      window.setTimeout(() => {
        location.assign("/user");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
export const logout = async function () {
  try {
    const response = await fetch("http://127.0.0.1:8000/logout", {
      method: "get",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      showAlert("success", "Deconnecter avec succès");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err);
  }
};
//ceci est ma fonction qui me permet d'envoyer la position actuelle
// à ma base de donnée liée à mon utilisateur
export const fetchNewPosition = async function (dataArray) {
  try {
    const response = await fetch("http://127.0.0.1:8000/positions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude: dataArray[0], longitude: dataArray[1] }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      showAlert("success", "Position successfully add");
    }
  } catch (err) {
    showAlert("error", err);
  }
};
