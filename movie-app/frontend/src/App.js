import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./components/home";
import Movies from "./components/movies";
import MovieDetail from "./components/MovieDetail";
import WatchPage from "./components/WatchPage";
import SeriesPage from "./components/series";
import SerieDetail from "./components/SerieDetail";
import WatchPageSerie from "./components/WatchPageSerie";
import Navbar from "./components/Navbar";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Navbar />
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
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/seriedetail/:id" element={<SerieDetail />} />
            <Route path="/watchserie/:id/:season/:episode" element={<WatchPageSerie />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-overlay" />
      </div>
      <AppRoutes />
    </Router>
  );
};

export default App;
