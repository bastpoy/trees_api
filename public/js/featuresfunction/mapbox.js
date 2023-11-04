//tout ce qui est lié à la mise en place de la map
mapboxgl.accessToken = "pk.eyJ1IjoiYmFzdHBveSIsImEiOiJjbGJsYTI4OG0wNWtiM3ZwcTI2eXl6MHJ0In0.xTnNhxFnfExC0qKFXX7I3Q";

export const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [4.851565, 45.752452], // starting center in [lng, lat] je centre ma map sur lyon
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
export function traceAllPoints(myPoints, otherPoints) {
  try {
    const arrayMyPoints = myPoints.map((point) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [point.longitude, point.latitude],
      },
    }));
    const arrayOtherPoints = otherPoints.map((point) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [point.longitude, point.latitude],
      },
    }));
    if (map.getLayer("treeLayer")) {
      map.removeLayer("treeLayer");
      map.removeLayer("treeLayer1");
    }
    if (map.getSource("myPoints")) {
      map.removeSource("myPoints");
      map.removeSource("otherPoints");
    }
    map.addSource("myPoints", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: arrayMyPoints,
      },
    });
    map.addSource("otherPoints", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: arrayOtherPoints,
      },
    });
    map.addLayer({
      // Add a layer to display the point
      id: "treeLayer",
      type: "circle",
      source: "myPoints",
      paint: {
        "circle-color": "#00b894",
        "circle-radius": 3,
      },
      layout: {
        visibility: "visible",
      },
    });
    map.addLayer({
      // Add a layer to display the point
      id: "treeLayer1",
      type: "circle",
      source: "otherPoints",
      paint: {
        "circle-color": "#d63031",
        "circle-radius": 3,
      },
      layout: {
        visibility: "visible",
      },
    });
  } catch (err) {
    console.log(err);
  }
}
