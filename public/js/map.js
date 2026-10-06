const mapContainer = document.getElementById("map");

if (mapContainer) {
  const mapToken = mapContainer.dataset.mapToken;

  if (mapToken && window.mapboxgl) {
    new mapboxgl.Map({
      accessToken: mapToken,
      container: mapContainer,
      center: [73.856255, 18.516726],
      zoom: 8,
    });
  } else {
    console.error("Mapbox map could not be initialized: missing token or Mapbox GL JS.");
  }
}

