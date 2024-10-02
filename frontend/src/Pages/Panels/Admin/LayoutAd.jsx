import Navbar from './AdminNavbar';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ marginLeft: '200px', padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
