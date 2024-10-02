import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Core
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

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
  const [showInterpolated, setShowInterpolated] = useState(true); // New state for toggling interpolated points

  // GeoJSON file URL (relative path to public folder or remote URL)
  const geojsonUrl = "./path/to/your/geojsonfile.geojson"; // Update with the correct path

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/v1/points`);
        const result = response.data;
        console.log("Fetched data:", result);

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
              width: 2,
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
                color: "green",
                size: "10px",
                outline: {
                  color: "white",
                  width: 1,
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

        // Load and add GeoJSON polyline to the map
        const geojsonLayer = new GeoJSONLayer({
          url: geojsonUrl,
        });

        webMap.add(geojsonLayer); // Add the GeoJSON layer to the WebMap
      }

      return () => {
        if (view) {
          view.container = null;
        }
      };
    }
  }, [points, interpolatedPoints, margin, gridSpace, showInterpolated]); // Re-render when value changes

  // Function to interpolate points
  const createInterpolatedGrid = (points, gridSpace, margin) => {
    const interpolatedPoints = [];

    // Determine the grid boundaries
    let minX = Math.min(...points.map((p) => p.x));
    let maxX = Math.max(...points.map((p) => p.x));
    let minY = Math.min(...points.map((p) => p.y));
    let maxY = Math.max(...points.map((p) => p.y));

    // Add margin to the grid boundaries
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;

    // Create grid points within the boundary
    for (let x = minX; x <= maxX; x += gridSpace) {
      for (let y = minY; y <= maxY; y += gridSpace) {
        interpolatedPoints.push({ x, y, ratio: 0, orientation: 0 });
      }
    }

    return interpolatedPoints;
  };

  return (
    <div>
      <div className="my-4 flex flex-row gap-4 items-center justify-between">
        <div className="text-sm flex gap-4">
          <label>
            Grid Space (KM):
            <input
              type="number"
              value={gridSpace}
              onChange={(e) => setGridSpace(Number(e.target.value))}
              className="ml-2 p-1 border rounded"
            />
          </label>
          <label>
            Grid Margin:
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="ml-2 p-1 border rounded"
            />
          </label>
        </div>
        <button
          className={`p-2 rounded-lg ${
            showInterpolated ? "bg-red-500" : "bg-blue-500"
          } text-white`}
          onClick={() => setShowInterpolated(!showInterpolated)}
        >
          {showInterpolated ? "Hide Interpolated Points" : "Show Interpolated Points"}
        </button>
      </div>

      <div className="w-full h-[60vh]" ref={mapDiv}></div>
    </div>
  );
};

export default Maps;
