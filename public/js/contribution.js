import { fetchNewPosition } from "./featuresfunction/fetch.js";

//ici je gère tous mes clicks de boutons
document.addEventListener("click", (ev) => {
  if (ev.target.className === "nav_button map_button") {
    window.setTimeout(() => {
      location.assign("/map");
    }, 1000);
  }
  if (ev.target.className === "nav_button user_button") {
    window.setTimeout(() => {
      location.assign("/user");
    }, 1000);
  }
  if (ev.target.className === "contribution_button") {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchNewPosition([position.coords.latitude, position.coords.longitude]);
      });
    }
  }
});
