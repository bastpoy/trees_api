import { allPositions } from "./positions.js";

//tout ce qui est lié à la mise en place de la map
mapboxgl.accessToken =
  "pk.eyJ1IjoiYmFzdHBveSIsImEiOiJjbGJsYTI4OG0wNWtiM3ZwcTI2eXl6MHJ0In0.xTnNhxFnfExC0qKFXX7I3Q";

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [4.851565, 45.752452], // starting center in [lng, lat]
  zoom: 12.5, // starting zoom
});
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  })
);
//j'affiche toutes les positions par defaut
let numberOfLayer = 0;
const returnPos = await allPositions();
tracePoint(returnPos);

export async function tracePoint(datas) {
  //cecei est utilisé pour la première connexion a ma map
  await map.on("load", function () {});
  // Add geolocate control to the map.
  //je crée un array de tous mes points de ma base de données
  const allPoints = datas.map((point) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
  }));
  //remove all the layer if it exists
  // console.log(`${numberOfLayer--}${numberOfLayer--}`);
  if (map.getLayer(`${numberOfLayer - 1}`)) {
    map.removeLayer(`${numberOfLayer - 1}`);
  }
  await map.addLayer({
    // Add a layer to display the point
    id: `${numberOfLayer}`,
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: allPoints,
      },
    },
    paint: {
      "circle-color": "#228B22",
      "circle-radius": 3,
    },
  });
  //j'incrémente pour me permettre de créer des id de nouvelles layers
  numberOfLayer++;
  //cecei permet de raffraichir quand j'appuie sur mon cursor
  await map.setStyle(map.getStyle());
}
