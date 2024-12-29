import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home";
import Movies from "./components/movies";
import MovieDetail from "./components/MovieDetail";
import WatchPage from "./components/WatchPage";
import SeriesPage from "./components/series";
import SerieDetail from "./components/SerieDetail";
import WatchPageSerie from "./components/WatchPageSerie";
import Navbar from "./components/Navbar";
import { FavoritesProvider } from "./components/FavoritesContext";

const App = () => {
  return (
    <FavoritesProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/seriedetail/:id" element={<SerieDetail />} />
          <Route path="/watchserie/:id/:season/:episode" element={<WatchPageSerie />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
};

export default App;
