const mapContainer = document.getElementById("map");

if (mapContainer) {
  const mapToken = mapContainer.dataset.mapToken;
  let coordinates;

  try {
    coordinates = JSON.parse(mapContainer.dataset.coordinates || "[]");
  } catch (error) {
    console.error("Map coordinates are not valid JSON.", error);
  }

  const hasCoordinates =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every(Number.isFinite);

  if (mapToken && window.mapboxgl && hasCoordinates) {
    const map = new mapboxgl.Map({
      accessToken: mapToken,
      container: mapContainer,
      center: coordinates,
      zoom: 8,
    });

    new mapboxgl.Marker({color:"red"})
      .setLngLat(coordinates)
      .addTo(map);
  } else {
    console.error(
      "Mapbox map could not be initialized: check the token, Mapbox GL JS, and listing coordinates.",
    );
  }
}
