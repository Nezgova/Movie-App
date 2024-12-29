import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import HomePage from "./components/home";
import Movies from "./components/movies";
import MovieDetail from "./components/MovieDetail";
import WatchPage from "./components/WatchPage";
import SeriesPage from "./components/series";
import SerieDetail from "./components/SerieDetail";
import WatchPageSerie from "./components/WatchPageSerie";
import Navbar from "./components/Navbar";
import ProfilePage from "./components/Profile";
import { FavoritesProvider } from "./components/FavoritesContext";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Set authentication status based on token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
  };

  // PrivateRoute component to protect routes
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <FavoritesProvider>
      <Router>
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/movies" element={<PrivateRoute element={<Movies />} />} />
          <Route path="/movie/:id" element={<PrivateRoute element={<MovieDetail />} />} />
          <Route path="/watch/:id" element={<PrivateRoute element={<WatchPage />} />} />
          <Route path="/series" element={<PrivateRoute element={<SeriesPage />} />} />
          <Route path="/seriedetail/:id" element={<PrivateRoute element={<SerieDetail />} />} />
          <Route path="/watchserie/:id/:season/:episode" element={<PrivateRoute element={<WatchPageSerie />} />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
};

export default App;
