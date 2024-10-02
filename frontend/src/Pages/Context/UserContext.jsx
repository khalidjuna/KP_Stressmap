import { createContext, useContext, useState, useEffect } from "react";
import * as AuthService from "../../Services/AuthService.jsx";

const UserContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State untuk menyimpan error

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await AuthService.init("/api/auth/v1/init${userId}");
        if (result.success) {
          setUser(result.user); // Pastikan ini adalah data user yang benar
        } else {
          throw new Error(result.message); // Meneruskan error jika ada
        }
      } catch (err) {
        setError(err.message); // Menyimpan pesan error
        setUser(null); // Set user ke null jika terjadi error
      } finally {
        setLoading(false); // Set loading ke false setelah selesai
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <UserContext.Provider value={{ user, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
