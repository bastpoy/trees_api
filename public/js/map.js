import { allPositions, myPositions, addPosition, otherPositions } from "./featuresfunction/positions.js";
import { map, traceAllPoints } from "./featuresfunction/mapbox.js";

const treeDiv = document.querySelector(".tree_type");
const treeDivInput = document.querySelectorAll('.tree_type input[type="button"]');

//au chargement de la page j'affiche tous les points par défaut
window.onload = async function () {
  const myPoints = await myPositions();
  const otherPoints = await otherPositions();
  map.on("load", () => {
    traceAllPoints(myPoints, otherPoints);
  });
};
//je regarde si ma box est checked ou pas et je renvoie les positions de moi ou toutes
document.querySelector(".checkbox").addEventListener("change", async function () {
  if (document.querySelector(".checkbox").checked) {
    map.setLayoutProperty("treeLayer1", "visibility", "none");
  } else {
    map.setLayoutProperty("treeLayer1", "visibility", "visible");
  }
});

//la gestion des boutons qui me renvoient sur les autres pages et qui ajoutent des positions d'arbres
document.addEventListener("click", (ev) => {
  // Aller dans l'user
  if (ev.target.className === "nav_button user_button") {
    window.setTimeout(() => {
      location.assign("/user");
    }, 1000);
  }
  //Aller dans contribution
  if (ev.target.className === "nav_button contribution_button") {
    window.setTimeout(() => {
      location.assign("/contribution");
    }, 1000);
  }
  // Dans le cas ou je donnes la position d'un arbre
  if (ev.target.className === "nav_button tree_position") {
    //j'affiche à l'écran tous la sorte d'arbre qu'il faut rentrer
    treeDiv.style.display = "block";
    //j'envoie le type d'arbre auquel je clique
    treeDivInput.forEach(function (input) {
      // je refresh la page je clique pas au bon endroit
      document.addEventListener("click", function (event) {
        if (!event.target.closest(".tree_type")) {
          treeDiv.style.display = "none";
          location.reload();
        }
      });
      input.addEventListener("click", function (event) {
        // j'enregistre la valeur du type d'arbre cliqué que j'ajoute ensuite
        const clickedValue = event.target.value;
        addPosition(clickedValue);
        treeDiv.style.display = "none";
      });
    });
    // je refresh la page je clique pas au bon endroit
    // document.addEventListener("click", function (event) {
    //   if (!event.target.closest(".tree_type")) {
    //     treeDiv.style.display = "none";
    //     location.reload();
    //   }
    // });
  }
});
