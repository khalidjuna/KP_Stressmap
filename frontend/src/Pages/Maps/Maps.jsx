import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Core
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
// import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";


// Widgets
import Compass from "@arcgis/core/widgets/Compass";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Measurement from "@arcgis/core/widgets/Measurement";

import Button from "./Button.jsx";
import axiosInstance from "../../Utils/AxiosUtil.jsx";

const Maps = () => {
  const mapDiv = useRef(null);
  const [margin, setMargin] = useState(5); // Initial margin is 5 lines
  const [gridSpace, setGridSpace] = useState(10); // Initial grid space is 10 km
  const [points, setPoints] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapTransparency, setHeatmapTransparency] = useState(0.5);
  const [interpolatedPoints, setInterpolatedPoints] = useState([]);
  const [showInterpolated, setShowInterpolated] = useState(false); // New state for toggling interpolated points
  // const datageojson = "./map.geojson";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/stressmap/api/v1/points`);
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

      const createHeatmapRenderer = (transparency) => ({
        type: "heatmap",
        field: "ratio",
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
        blurRadius: 15,
        minDensity: 0,
        maxPixelIntensity: 100,
      });

      // Add heatmap layer if showHeatmap is true
      let heatmapLayer = null;
      if (showHeatmap) {
        const heatmapPoints = interpolatedPoints.map((point) => ({
          geometry: {
            type: "point",
            x: point.x,
            y: point.y,
          },
          attributes: {
            ratio: point.ratio, // Menggunakan atribut interpolasi untuk intensitas heatmap
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




      // Find the maximum and minimum X and Y coordinates
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      if (Array.isArray(points)) {
        points.forEach((point) => {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        });

        // Create grid lines
        const gridSize = gridSpace / 100; // km

        // Add margin of 5 grid lines
        const marginSize = margin * gridSize; // Convert margin to kilometers
        minX -= marginSize;
        minY -= marginSize;
        maxX += marginSize;
        maxY += marginSize;

        const gridLines = [];
        for (let x = minX; x <= maxX; x += gridSize) {
          const line = new Polyline({
            paths: [
              [x, minY],
              [x, maxY],
            ],
          });
          gridLines.push(line);
        }
        for (let y = minY; y <= maxY; y += gridSize) {
          const line = new Polyline({
            paths: [
              [minX, y],
              [maxX, y],
            ],
          });
          gridLines.push(line);
        }

        gridLines.forEach((line) => {
          const graphicLine = new Graphic({
            geometry: line,
            symbol: {
              type: "simple-line",
              color: [0, 0, 0, 0],
              width: 1,
            },
          });
          view.graphics.add(graphicLine);
        });

        // Add original points and their orientations
        points.forEach((point) => {
          const graphicPoint = new Graphic({
            geometry: new Point({
              longitude: point.x,
              latitude: point.y,
            }),
            symbol: {
              type: "simple-marker",
              color: "blue",
              size: "12px",
              outline: {
                color: "white",
                width: 1,
              },
            },
            attributes: point,
            popupTemplate: {
              title: "Point Information",
              content: `
                <ul>
                  <li><b>X:</b> {x}</li>
                  <li><b>Y:</b> {y}</li>
                  <li><b>Ratio:</b> {ratio}</li>
                  <li><b>Orientation:</b> {orientation}</li>
                </ul>
              `,
              location: "auto",
            },
          });

          const length = 0.01; // Length of the line, can be adjusted
          const angleRad = point.orientation * (Math.PI / 180); // Convert angle to radians
          const offsetX = length * Math.cos(angleRad);
          const offsetY = length * Math.sin(angleRad);

          const polyline = new Polyline({
            paths: [
              [point.x - offsetX, point.y - offsetY], // Start point (adjusted for center)
              [point.x + offsetX, point.y + offsetY], // End point (adjusted for center)
            ],
          });

          const graphicLine = new Graphic({
            geometry: polyline,
            symbol: {
              type: "simple-line",
              color: "red",
              width: 0.5,
            },
          });

          view.graphics.add(graphicPoint);
          view.graphics.add(graphicLine);
        });

        // Add interpolated points only if showInterpolated is true
        if (showInterpolated) {
          interpolatedPoints.forEach((point) => {
            const graphicPoint = new Graphic({
              geometry: new Point({
                longitude: point.x,
                latitude: point.y,
              }),
              symbol: {
                type: "simple-marker",
                color: showInterpolated ? "green" : "rgba(0, 0, 0, 1)", // Transparan jika tidak ingin terlihat
                size: showInterpolated ? "10px" : "10px", // Ukuran nol agar titik tidak terlihat
                outline: {
                  color: "white",
                  width: showInterpolated ? 1 : 0, // Hapus outline jika tidak ingin terlihat
                },
              },
              attributes: point,
              popupTemplate: {
                title: "Interpolated Point Information",
                content: `
                  <ul>
                    <li><b>X:</b> {x}</li>
                    <li><b>Y:</b> {y}</li>
                    <li><b>Ratio:</b> {ratio}</li>
                    <li><b>Orientation:</b> {orientation}</li>
                  </ul>
                `,
                location: "auto",
              },
            });

            view.graphics.add(graphicPoint);
          });
        }
      }

      // Load and add GeoJSON polyline to the map
      // const geojsonLayer = new GeoJSONLayer({
      //   url: "./data2.geojson",
      //   renderer: {
      //     type: "polyline", 
      //     symbol: {
      //       type: "simple-line", 
      //       color: "red",  
      //       width: 2, 
      //     },
      //   },
      // });

      
      // webMap.add(geojsonLayer);

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
    heatmapTransparency
  ]); // Re-render when value changes

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
            padding: "10px",
          }}
        >
          <span style={{ marginRight: "10px" }}>Margin Grid :</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setMargin((prev) => prev - 1)}
          >
            -
          </button>
          <span style={{ margin: "0 10px" }}>{margin} line</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setMargin((prev) => prev + 1)}
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
            padding: "10px",
          }}
        >
          <span style={{ marginRight: "10px" }}>Space Grid :</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setGridSpace((prev) => prev - 1)}
          >
            -
          </button>
          <span style={{ margin: "0 10px" }}>{gridSpace} km</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setGridSpace((prev) => prev + 1)}
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
            padding: "10px",
          }}
        >
          <span style={{ marginRight: "10px" }}>Show Interpolated Points:</span>
          <button
            style={{ padding: "5px" }}
            onClick={() => setShowInterpolated((prev) => !prev)}
          >
            {showInterpolated ? "Hide" : "Show"}
          </button>
        </div>
      </div>
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
        <label style={{ marginRight: "10px" }}>
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
        <label style={{ marginRight: "10px" }}>
          Show Heatmap:
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            style={{ marginLeft: "10px" }}
          />
        </label>
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
      <Button/>
    </div>
  );
};

export default Maps;
