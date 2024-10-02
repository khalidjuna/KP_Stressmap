import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Pointer} from 'ol/interaction';
import 'ol/ol.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Download from "./Download.jsx";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

const Button = () => {
  const mapRef = useRef();
  const mapDiv = useRef(null);
  const selectInteractionRef = useRef(null);
  const coordinatesRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangle, setRectangle] = useState(null);
  const [downloadData, setDownloadData] = useState([]);

  const [selectedPoints, setSelectedPoints] = useState([]);
  // const [rectangle, setRectangle] = useState(null);
  // const [downloadData, setDownloadData] = useState([]);

  useEffect(() => {
    if (mapDiv.current) {
      const webMap = new WebMap({
        basemap: "topo-vector",
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webMap,
        center: [106.0672384, -6.123776753],
        zoom: 10,
      });

      // Event listener for clicking on the map to select two points
      view.on("click", (event) => {
        if (isDrawing && selectedPoints.length < 2) {
          setSelectedPoints((prev) => [...prev, event.mapPoint]);
        }
      });

      // If two points are selected, create the rectangle
      if (selectedPoints.length === 2) {
        const p1 = selectedPoints[0];
        const p2 = selectedPoints[1];

        // Create rectangle from two points
        const polygon = new Polygon({
          rings: [
            [
              [p1.longitude, p1.latitude],
              [p2.longitude, p1.latitude],
              [p2.longitude, p2.latitude],
              [p1.longitude, p2.latitude],
              [p1.longitude, p1.latitude],
            ],
          ],
        });

        const graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill",
            color: [0, 0, 255, 0.2],
            outline: {
              color: [255, 0, 0],
              width: 2,
            },
          },
        });

        view.graphics.add(graphic);
        setRectangle(polygon);

        // After rectangle creation, search for points inside the rectangle
        searchPointsInArea(polygon);
        setIsDrawing(false); // Stop drawing after rectangle is created
      }
    }
  }, [selectedPoints, isDrawing]);

  const searchPointsInArea = (rectangle) => {
    // Dummy data points (replace with real data source or API call)
    const points = [
      { x: 106.1, y: -6.12, ratio: 0.5, orientation: 90 },
      { x: 106.2, y: -6.15, ratio: 0.7, orientation: 60 },
      { x: 106.3, y: -6.14, ratio: 0.6, orientation: 75 },
    ];

    // Filter points that are inside the rectangle using geometryEngine
    const pointsInArea = points.filter((point) => {
      const pointGraphic = new Graphic({
        geometry: {
          type: "point",
          longitude: point.x,
          latitude: point.y,
        },
      });
      return geometryEngine.contains(rectangle, pointGraphic.geometry);
    });

    setDownloadData(pointsInArea);
  };

  const startDrawingRectangle = () => {
    setSelectedPoints([]); // Clear previous points
    setIsDrawing(true); // Start the drawing process
    setRectangle(null); // Clear any previous rectangle
    setDownloadData([]); // Clear any previous download data
  };

  const handleHandMode = () => {
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }
    if (!selectInteractionRef.current) {
      selectInteractionRef.current = new Pointer({
        handleMoveEvent: (event) => {
          const pixel = event.map.getEventPixel(event.originalEvent);
          const hit = event.map.forEachFeatureAtPixel(pixel, () => {
            return true;
          });
          event.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        },
      });
      mapRef.current.addInteraction(selectInteractionRef.current);
    }
  };


  const handleCloseDownloadPopup = () => {
    setShowDownloadPopup(false);
  };

  const handleDownload = () => {
    console.log('Download selected area:', selectedArea);
  };

  const handleClearSelection = () => {
    mapRef.current.vectorSource.clear();
    setSelectedArea(null);
  };

  return (
    <div className="map-controls">
      <div ref={coordinatesRef} className="coordinates"></div>
      <div className="controls">
        <div className="mode-controls">
          <button className="btn btn-light" onClick={handleHandMode} style={{ color: '#007bff' }}>
            <i className="bi bi-hand-index"></i>
          </button>
          <button className="btn btn-light" onClick={startDrawingRectangle} style={{ color: '#007bff' }}>
            <i className="bi bi-square"></i>
          </button>
        </div>
        <div className="selection-controls">
          <button className="btn btn-light" onClick={handleClearSelection} style={{ color: '#dc3545' }}>
            <i className="bi bi-trash"></i>
          </button>
          {rectangle && downloadData.length > 0 && (
            <Download data={downloadData} />
          )}
        </div>
      </div>
      {showDownloadPopup && (
        <Download
          onClose={handleCloseDownloadPopup}
          selectedArea={selectedArea}
          onDownload={handleDownload}
        />
      )}
      <style>
        {`
          .map-container {
            width: 100%;
            height: calc(100vh);
          }

          .coordinates {
            position: absolute;
            top: 70px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
          }

          .controls {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
          }
          .zoom-controls {
            display: flex;
            flex-direction: column;
            margin-bottom: 3px;
          }
          .mode-controls {
            display: flex;
            flex-direction: column;
            margin-bottom: 3px;
          }
          .selection-controls {
            display: flex;
            flex-direction: column;
          }
          .btn {
            margin-bottom: 3px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

export default Button;