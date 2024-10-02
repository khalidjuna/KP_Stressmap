import PropTypes from "prop-types";
import Loader from "react-js-loader";

export const BubblePing = ({ bgColor, color, size }) => {
  bgColor = bgColor || "#ccc4";
  color = color || "#ccc4";
  size = size || 100;

  return (
    <Loader type="bubble-ping" bgColor={bgColor} color={color} size={size} />
  );
};

BubblePing.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

export const Spinner = ({ title, bgColor, color, size }) => {
  title = title || "";
  bgColor = bgColor || "#ccc4";
  color = color || "#ccc4";
  size = size || 100;

  return (
    <Loader
      type="spinner-default"
      title={title}
      bgColor={bgColor}
      color={color}
      size={size}
    />
  );
};

Spinner.propTypes = {
  title: PropTypes.string,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};
