import { deletePosition } from "./featuresfunction/positions.js";
import { logout } from "./featuresfunction/fetch.js";

const button = document.querySelectorAll(".close-button");

document.addEventListener("click", (ev) => {
  ev.preventDefault();
  // console.log(ev.target.className);
  if (ev.target.className === "nav_button map_button") {
    window.setTimeout(() => {
      location.assign("/map");
    }, 1000);
  }
  if (ev.target.className === "nav_button contribution_button") {
    window.setTimeout(() => {
      location.assign("/contribution");
    }, 1000);
  }
  if (ev.target.className === "logout") {
    logout();
  }
});
console.log(button);
button.forEach((el) =>
  el.addEventListener("click", (ev) => {
    ev.preventDefault();
    const div = ev.target.parentNode;
    deletePosition(div.parentNode.id);
  })
);
