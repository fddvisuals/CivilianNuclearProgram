// Step 3: Add JavaScript
mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2YWtwYXRlbCIsImEiOiJjbGY4bGx2bHowMXE5NDVxaW1yZHdqcTE5In0.td4c1CFsbvfnYn8xO2ivQA"; // Replace with your own access token

let geojsonData;

fetch("data.geojson")
  .then((response) => response.json())
  .then((data) => {
    geojsonData = data;
    initializeMap();
  });

function initializeMap() {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/navigation-night-v1",
    center: [5, 34],
    zoom: 1,
  });

  map.on("load", function () {
    map.addSource("countries", {
      type: "geojson",
      data: geojsonData,
    });

    map.addLayer({
      id: "country-layer",
      type: "fill",
      source: "countries",
      layout: {},
      paint: { "fill-color": "#EB5E55", "fill-opacity": 0.4 }, // choose your own color and opacity
    });

    map.addLayer({
      id: "country-highlight",
      type: "fill",
      source: "countries",
      layout: {},
      paint: { "fill-color": "#EB5E55", "fill-opacity": 0.8 },
      filter: ["==", "Name", ""],
    });

    map.setFilter("country-layer", ["==", "operational", "Yes"]);

    map.on("mousemove", "country-layer", function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      var countryName = e.features[0].properties.Name;
      var operationalStatus = e.features[0].properties.operational;
      var consStatus = e.features[0].properties.construction;
      var enrichmentStatus = e.features[0].properties.enrichment;
      var reproStatus = e.features[0].properties.repro;
      var nptStatus = e.features[0].properties.npt;
      var outsideStatus = e.features[0].properties["outside-npt"]; // Use bracket notation for properties with hyphen

      document.getElementById("tooltip").style.display = "block";

      document.getElementById("countryname").innerHTML = countryName;
      document.getElementById(
        "operation"
      ).innerHTML = operationalStatus;
      document.getElementById(
        "construction"
      ).innerHTML = consStatus;
      document.getElementById(
        "enrich"
      ).innerHTML = enrichmentStatus;
      document.getElementById(
        "repro"
      ).innerHTML = reproStatus;
      document.getElementById(
        "npt"
      ).innerHTML = nptStatus;
      document.getElementById(
        "outside-npt"
      ).innerHTML = outsideStatus;

      map.setFilter("country-highlight", [
        "==",
        "Name",
        e.features[0].properties.Name,
      ]);
    });

    map.on("mouseleave", "country-layer", function () {
      document.getElementById("tooltip").style.display = "none";
      map.setFilter("country-highlight", ["==", "Name", ""]);
      map.getCanvas().style.cursor = "";
    });

    document
      .getElementById("filter_button_1")
      .addEventListener("click", function () {
        map.setFilter("country-layer", ["==", "operational", "Yes"]);
      });

    document
      .getElementById("filter_button_2")
      .addEventListener("click", function () {
        map.setFilter("country-layer", ["==", "construction", "Yes"]);
      });

    document
      .getElementById("filter_button_3")
      .addEventListener("click", function () {
        map.setFilter("country-layer", ["==", "enrichment", "Yes"]);
      });

    document
      .getElementById("filter_button_4")
      .addEventListener("click", function () {
        map.setFilter("country-layer", ["==", "repro", "Yes"]);
      });
    document
      .getElementById("filter_button_5")
      .addEventListener("click", function () {
        map.setFilter("country-layer", ["==", "npt", "Yes"]);
      });
    document
      .getElementById("filter_button_6")
      .addEventListener("click", function () {
        map.setFilter("country-layer", ["==", "outside-npt", "Yes"]);
      });

    // Get all filter buttons
    var filterButtons = document.querySelectorAll(".button");

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach(function (btn) {
          btn.classList.remove("active");
        });

        // Add active class to the clicked button
        this.classList.add("active");

        // Set filter according to the button clicked
        var filterKey = this.getAttribute("data-filter-key");
        var filterValue = this.getAttribute("data-filter-value");

        map.on("load", function () {
          map.setFilter("country-layer", ["==", filterKey, filterValue]);
        });
      });
    });
  });
}
