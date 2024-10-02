import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Core
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
// import Graphic from "@arcgis/core/Graphic";

// Widgets
import Compass from "@arcgis/core/widgets/Compass";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Measurement from "@arcgis/core/widgets/Measurement";

const Maps = () => {
  const mapDiv = useRef(null);
  const [margin, setMargin] = useState(5); // Initial margin is 5 lines
  const [gridSpace, setGridSpace] = useState(10); // Initial grid space is 10 km
  const [points, setPoints] = useState([]);
  const [interpolatedPoints, setInterpolatedPoints] = useState([]);
  const [showInterpolated, setShowInterpolated] = useState(true); // State for toggling interpolated points
  const [showHeatmap, setShowHeatmap] = useState(false); // State for toggling heatmap
  const [heatmapTransparency, setHeatmapTransparency] = useState(0.5); // New state for heatmap transparency

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/v1/points`);
        const result = response.data;
        console.log("Fetched data:", result);

        // Check and transform data to JSON format if necessary
        if (result && result.points) {
          setPoints(result.points);
        } else if (Array.isArray(result)) {
          const pointsData = result.map((item) => ({
            x: item.x,
            y: item.y,
            ratio: item.ratio,
            orientation: item.orientation,
          }));
          setPoints(pointsData);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (points.length > 1) {
      const newInterpolatedPoints = createInterpolatedGrid(
        points,
        gridSpace,
        margin
      );
      setInterpolatedPoints(newInterpolatedPoints);
    }
  }, [points, gridSpace, margin]);

  useEffect(() => {
    if (mapDiv.current) {
      const webMap = new WebMap({
        basemap: "topo-vector",
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webMap,
        center: [106.0672384, -6.123776753], // Center the map to one of the points
        zoom: 10,
      });
      view.popup.defaultPopupTemplateEnabled = true;
      view.popup.dockEnabled = false;
      view.popup.autoOpenEnabled = true;

      // Add Compass widget
      const compass = new Compass({
        view: view,
      });
      view.ui.add(compass, "top-left");

      // Add ScaleBar widget
      const scaleBar = new ScaleBar({
        view: view,
        unit: "dual", // Use both metric and non-metric units
      });
      view.ui.add(scaleBar, "bottom-right");

      // Add Measurement widget
      const measurement = new Measurement({
        view: view,
      });
      view.ui.add(measurement, "bottom-right");

      // Function to create heatmap renderer with adjustable transparency
      const createHeatmapRenderer = (transparency) => ({
        type: "heatmap",
        colorStops: [
          { color: `rgba(63, 40, 102, ${1 - transparency})`, ratio: 0 },
          { color: `rgba(94, 79, 162, ${1 - transparency})`, ratio: 1 },
          { color: `rgba(50, 136, 189, ${1 - transparency})`, ratio: 0.166 },
          { color: `rgba(102, 194, 165, ${1 - transparency})`, ratio: 0.25 },
          { color: `rgba(171, 221, 164, ${1 - transparency})`, ratio: 0.333 },
          { color: `rgba(230, 245, 152, ${1 - transparency})`, ratio: 0.416 },
          { color: `rgba(255, 255, 191, ${1 - transparency})`, ratio: 0.5 },
          { color: `rgba(254, 224, 139, ${1 - transparency})`, ratio: 0.583 },
          { color: `rgba(253, 174, 97, ${1 - transparency})`, ratio: 0.666 },
          { color: `rgba(244, 109, 67, ${1 - transparency})`, ratio: 0.75 },
          { color: `rgba(215, 48, 39, ${1 - transparency})`, ratio: 0.833 },
          { color: `rgba(158, 1, 66, ${1 - transparency})`, ratio: 0.916 },
        ],
        blurRadius: 10,
        maxPixelIntensity: 100,
        minPixelIntensity: 0,
      });

      // Add heatmap layer if showHeatmap is true
      let heatmapLayer = null;
      if (showHeatmap) {
        const heatmapPoints = points.map((point) => ({
          geometry: {
            type: "point",
            x: point.x,
            y: point.y,
          },
          attributes: {
            ratio: point.ratio, // Example attribute used for heatmap intensity
          },
        }));

        heatmapLayer = new FeatureLayer({
          source: heatmapPoints,
          renderer: createHeatmapRenderer(heatmapTransparency),
          fields: [
            {
              name: "ratio",
              alias: "Ratio",
              type: "double",
            },
          ],
          objectIdField: "ObjectID",
        });

        webMap.add(heatmapLayer);
      }

      return () => {
        if (view) {
          view.container = null;
        }
        if (heatmapLayer) {
          webMap.remove(heatmapLayer);
        }
      };
    }
  }, [
    points,
    interpolatedPoints,
    margin,
    gridSpace,
    showInterpolated,
    showHeatmap,
    heatmapTransparency, // Re-render when transparency changes
  ]);

  // Function to interpolate points
  const createInterpolatedGrid = (points, gridSpace, margin) => {
    const interpolatedPoints = [];

    // Determine the grid boundaries
    let minX = Math.min(...points.map((p) => p.x));
    let maxX = Math.max(...points.map((p) => p.x));
    let minY = Math.min(...points.map((p) => p.y));
    let maxY = Math.max(...points.map((p) => p.y));

    // Add margin to the boundaries
    const gridSize = gridSpace / 100; // Convert grid space to the appropriate unit if necessary
    const marginSize = margin * gridSize;
    minX -= marginSize;
    minY -= marginSize;
    maxX += marginSize;
    maxY += marginSize;

    // Create a grid of points with specified spacing
    for (let x = minX; x <= maxX; x += gridSize) {
      for (let y = minY; y <= maxY; y += gridSize) {
        // Interpolate values for the grid point
        const interpolatedValue = interpolate2D(x, y, points);
        if (interpolatedValue) {
          interpolatedPoints.push(interpolatedValue);
        }
      }
    }
    return interpolatedPoints;
  };

  // Function to perform 2D interpolation
  const interpolate2D = (x, y, points) => {
    let sumRatios = 0;
    let sumWeights = 0;

    points.forEach((point) => {
      const dx = x - point.x;
      const dy = y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const weight = 1 / (distance || 1); // Prevent division by zero

      sumRatios += point.ratio * weight;
      sumWeights += weight;
    });

    if (sumWeights === 0) return null; // To prevent division by zero

    const interpolatedRatio = sumRatios / sumWeights;
    return { x, y, ratio: interpolatedRatio, orientation: 0 };
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: "9999",
        }}
      >
        <div
          style={{
            textAlign: "right",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            backgroundColor: "white",
            padding: "5px",
            marginBottom: "5px",
          }}
        >
          <label style={{ marginRight:"10px" }}>
            Margin Grid:
          </label>
          <button
            style={{ padding: "3px" }}
            onClick={() => setMargin((prev) => prev - 1)}
            aria-label="Decrease Margin"
          >
            -
          </button>
          <span style={{ margin: " 10px" }}>{margin} line</span>
          <button
            style={{ padding: "3px" }}
            onClick={() => setMargin((prev) => prev + 1)}
            aria-label="Increase Margin"
          >
            +
          </button>
        </div>
        <div
          style={{
            textAlign: "right",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            backgroundColor: "white",
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginRight:"10px" }}>
            Space Grid:
          </label>
          <button
            style={{ padding: "3px" }}
            onClick={() => setGridSpace((prev) => prev - 1)}
            aria-label="Decrease Grid Space"
          >
            -
          </button>
          <span style={{ margin: "10px" }}>{gridSpace} km</span>
          <button
            style={{ padding: "3px" }}
            onClick={() => setGridSpace((prev) => prev + 1)}
            aria-label="Increase Grid Space"
          >
            +
          </button>
        </div>
        <div
          style={{
            textAlign: "right",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            backgroundColor: "white",
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginRight:"10px" }}>
            Show Interpolated Points:
          </label>
          <button
            style={{ padding: "3px" }}
            onClick={() => setShowInterpolated((prev) => !prev)}
            aria-label="Toggle Interpolated Points"
          >
            {showInterpolated ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
          zIndex: "1",
        }}
        ref={mapDiv}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          zIndex: "9999",
          backgroundColor: "white",
          padding: "5px",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
        }}
      >
        <label style={{ marginRight:"10px" }}>
          Heatmap Transparency:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={heatmapTransparency}
            onChange={(e) => setHeatmapTransparency(parseFloat(e.target.value))}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label style={{ marginRight:"10px" }}>
          Show Heatmap:
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>
    </div>
  );
};

export default Maps;
