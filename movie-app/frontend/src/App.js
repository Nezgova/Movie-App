import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { FavoritesProvider } from "./components/FavoritesContext"; // Import the FavoritesProvider

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

  return (
    <FavoritesProvider> {/* Wrap the entire app with FavoritesProvider */}
      <Router>
        {isAuthenticated && <Navbar onLogout={handleLogout} />}{" "}
        {/* Show Navbar only if authenticated */}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/movies"
            element={isAuthenticated ? <Movies /> : <Navigate to="/login" />}
          />
          <Route
            path="/movie/:id"
            element={isAuthenticated ? <MovieDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/watch/:id"
            element={isAuthenticated ? <WatchPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/series"
            element={isAuthenticated ? <SeriesPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/seriedetail/:id"
            element={
              isAuthenticated ? <SerieDetail /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/watchserie/:id/:season/:episode"
            element={
              isAuthenticated ? <WatchPageSerie /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
};

export default App;
