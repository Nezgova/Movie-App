import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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

const AppRoutes = ({ isAuthenticated, handleLogout, setIsAuthenticated }) => {
  const location = useLocation();

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="app-shell">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="app-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Routes location={location}>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" /> : <Register />}
            />
            <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
            <Route path="/movies" element={<PrivateRoute element={<Movies />} />} />
            <Route path="/movie/:id" element={<PrivateRoute element={<MovieDetail />} />} />
            <Route path="/watch/:id" element={<PrivateRoute element={<WatchPage />} />} />
            <Route path="/series" element={<PrivateRoute element={<SeriesPage />} />} />
            <Route path="/seriedetail/:id" element={<PrivateRoute element={<SerieDetail />} />} />
            <Route path="/watchserie/:id/:season/:episode" element={<PrivateRoute element={<WatchPageSerie />} />} />
            <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
  };

  return (
    <FavoritesProvider>
      <Router>
        <div className="ambient-bg" aria-hidden="true">
          <div className="ambient-overlay" />
        </div>
        <AppRoutes isAuthenticated={isAuthenticated} handleLogout={handleLogout} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </FavoritesProvider>
  );
};

export default App;
