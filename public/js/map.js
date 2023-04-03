import { allPositions } from "./featuresfunction/positions.js";
import { myPositions } from "./featuresfunction/positions.js";
import { tracePoint } from "./featuresfunction/mapbox.js";

//je regarde si ma box est checked ou pas et je renvoie les positions de moi ou toutes
document
  .querySelector(".checkbox")
  .addEventListener("change", async function () {
    if (document.querySelector(".checkbox").checked) {
      const returnPos = await myPositions();
      tracePoint(returnPos);
    } else {
      const returnPos = await allPositions();
      tracePoint(returnPos);
    }
  });

//la gestion des boutons qui me renvoient sur les autres pages
document.addEventListener("click", (ev) => {
  if (ev.target.className === "nav_button user_button") {
    window.setTimeout(() => {
      location.assign("/user");
    }, 1000);
  }
  if (ev.target.className === "nav_button contribution_button") {
    window.setTimeout(() => {
      location.assign("/contribution");
    }, 1000);
  }
});
