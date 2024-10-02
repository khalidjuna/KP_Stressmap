import { useState, useEffect } from 'react';
import Layout from './LayoutAd.jsx';
import axios from 'axios';

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(2); 
  
  // Fungsi untuk mengambil data user dari API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Panggil fetchUsers ketika komponen dirender pertama kali
  }, []);

  const toggleActive = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return { ...user, active: !user.active };
      }
      return user;
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logika pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          style={styles.paginationButton}
          onClick={() => handlePageClick(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const styles = {
    userListContainer: {
      maxWidth: '80%',
      padding: '20px',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    header: {
      textAlign: 'center',
      fontFamily: 'Playfair Display, serif',
      fontSize: '24px',
      marginBottom: '20px',
      marginRight: '310px',
    },
    userListTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      marginLeft: '250px',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    tableHead: {
      backgroundColor: '#fff',
    },
    tableCell: {
      padding: '8px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      fontSize: '13px',
      fontFamily: 'Poppins, sans-serif',
    },
    evenRow: {
      backgroundColor: '#fff',
    },
    button: {
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      padding: '5px 8px',
      borderRadius: '3px',
      transition: 'background-color 0.3s',
    },
    editButton: {
      marginRight: '3px',
    },
    activeButton: {
      backgroundColor: '#E0FBE2', 
      color: '#008767', 
      border: '2px solid #008767', 
      borderRadius: '10px',
      fontWeight: 'bold',
      padding: '10px 15px',
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
    },    
    inactiveButton: {
      backgroundColor: '#FFC5C5',
      color: '#DF0404',
      border: '2px solid #DF0404',
      borderRadius: '10px',
      fontWeight: 'bold',
      padding: '10px 15px',
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
    },
    searchContainer: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginRight: '-190px',
      fontFamily: 'Playfair Display, serif',
    },
    searchInput: {
      padding: '8px',
      width: '30%',
      borderRadius: '3px',
      border: '1px solid #ddd',
      marginRight: '10px',
      fontSize: '14px',
    },
    searchButton: {
      padding: '8px 12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    paginationContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '-20px',
      marginLeft: '1030px', 
    },    
    paginationButton: {
      padding: '8px 12px',
      margin: '0 5px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    pageInfo: {
      fontSize: '14px',
      fontFamily: 'Poppins, sans-serif',
      marginLeft: '250px',
      marginTop: '10px',
    },
    paginationButtonActive: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.userListContainer}>
      <h2 style={styles.header}>View All Users</h2>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={handleSearch}
        />
        <button style={styles.searchButton}>Search</button>
      </div>
      <table style={styles.userListTable}>
        <thead>
          <tr style={styles.tableHead}>
            <th style={styles.tableCell}>Name</th>
            <th style={styles.tableCell}>Email</th>
            <th style={styles.tableCell}>Position</th>
            <th style={styles.tableCell}>Institution</th>
            <th style={styles.tableCell}>City</th>
            <th style={styles.tableCell}>Country</th>
            <th style={styles.tableCell}>Role</th>
            <th style={styles.tableCell}>Status</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id} style={{ ...styles.tableRow, ...(index % 2 === 0 && styles.evenRow) }}>
              <td style={styles.tableCell}>{user.name}</td>
              <td style={styles.tableCell}>{user.email}</td>
              <td style={styles.tableCell}>{user.position}</td>
              <td style={styles.tableCell}>{user.institution}</td>
              <td style={styles.tableCell}>{user.city}</td>
              <td style={styles.tableCell}>{user.country}</td>
              <td style={styles.tableCell}>{user.role}</td>
              <td style={styles.tableCell}>{user.active ? 'Active' : 'Inactive'}</td>
              <td style={styles.tableCell}>
                <button
                  style={{
                    ...styles.button,
                    ...styles.editButton,
                    ...(user.active ? styles.activeButton : styles.inactiveButton)
                  }}
                  onClick={() => toggleActive(user.id)}
                  className={user.active ? 'active' : 'inactive'}
                >
                  {user.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.pageInfo}>
        Showing data {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
      </div>
      <div style={styles.paginationContainer}>
        <button style={styles.paginationButton} onClick={handlePrevPage} disabled={currentPage === 1}>
          {'<'}
        </button>
        {renderPageNumbers()}
        <button style={styles.paginationButton} onClick={handleNextPage} disabled={currentPage === totalPages}>
          {'>'}
        </button>
      </div>
      <Layout />
    </div>
  );
  };
  
  export default ViewUser;
  