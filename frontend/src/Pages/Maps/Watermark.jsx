import PropTypes from "prop-types";

const Watermark = ({ text }) => {
  return (
    <div style={watermarkStyle}>
      {Array(10)
        .fill()
        .flatMap((_, rowIndex) =>
          Array(10)
            .fill()
            .map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={getDiagonalWatermarkStyle(rowIndex, colIndex)}
              >
                {text}
              </div>
            ))
        )}
    </div>
  );
};

// Validasi properti yang diperlukan
Watermark.propTypes = {
  text: PropTypes.string.isRequired,
};

const watermarkStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  zIndex: 1000,
  overflow: "hidden",
};

const getDiagonalWatermarkStyle = (rowIndex, colIndex) => {
  const step = 15; // Adjust this value to change the spacing between watermarks
  const leftPosition = step * colIndex;
  const topPosition = step * rowIndex;
  const rotation = 45; // Rotate watermark by 45 degrees to follow diagonal line

  return {
    position: "absolute",
    transform: `rotate(${rotation}deg)`,
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: "12px",
    whiteSpace: "nowrap",
    left: `${leftPosition}%`,
    top: `${topPosition}%`,
  };
};

export default Watermark;
