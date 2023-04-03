import { showAlert } from "./alerts.js";

//je récupère tous mes points de ma base de donnée
export const allPositions = async function () {
  try {
    const response = await fetch("http://127.0.0.1:3000/positions", {
      method: "GET",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      const data = await response.json();
      return data.data;
      // showAlert("success", "Logged in successfully!");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

export const myPositions = async function () {
  try {
    const response = await fetch("http://127.0.0.1:3000/myPositions", {
      method: "GET",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      const data = await response.json();
      return data.data;
      // showAlert("success", "Logged in successfully!");
    }
  } catch (err) {
    showAlert("error", err);
  }
};
export const deletePosition = async function (id) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/position/${id}`, {
      method: "delete",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      window.location.reload();
      showAlert("success", "Position supprimé avec succès");
    }
  } catch (err) {
    showAlert("error", err);
  }
};
