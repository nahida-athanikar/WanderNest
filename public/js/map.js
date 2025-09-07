 mapboxgl.accessToken = mapToken;

 const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates, // Delhi ke coords
  zoom: 9,
});

// map.on("load", () => {
//   map.resize();
// });

const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);

