import { showAlert } from "./alerts.js";
import { fetchNewPosition } from "./fetch.js";

//je récupère tous mes points de ma base de donnée
export const allPositions = async function () {
  try {
    const response = await fetch("/positions", {
      method: "GET",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    showAlert("error", err);
  }
};

export const myPositions = async function () {
  try {
    const response = await fetch("/myPositions", {
      method: "GET",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    showAlert("error", err);
  }
};
export const otherPositions = async function () {
  try {
    const response = await fetch("/otherPositions", {
      method: "GET",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    showAlert("error", err);
  }
};
export const deletePosition = async function (id) {
  try {
    const response = await fetch(`/position/${id}`, {
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
export const addPosition = async function (treeType) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchNewPosition([
          position.coords.latitude,
          position.coords.longitude,
          treeType,
        ]);
      },
      (error) => {
        showAlert("error", "Error lors de l'ajout de l'arbre 🌳🌳");
        console.error("Error getting position:", error);
      },
      { maximumAge: 0, timeout: 100000, enableHighAccuracy: true }
    );
  }
};
