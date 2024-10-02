import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Home from '@arcgis/core/widgets/Home';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';

const MapWidgets = ({ view }) => {
  useEffect(() => {
    if (view) {
      view.ui.add(
        new Home({
          view: view,
        }),
        'top-left'
      );

      view.ui.add(
        new ScaleBar({
          view: view,
        }),
        'bottom-left'
      );
    }
  }, [view]);

  return null;
};

MapWidgets.propTypes = {
  view: PropTypes.shape({
    ui: PropTypes.shape({
      add: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default MapWidgets;
