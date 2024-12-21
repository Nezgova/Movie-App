import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/home'; 
import Movies from './components/movies'; 
import Register from './components/register';
import MovieDetail from './components/MovieDetail';
import WatchPage from './components/WatchPage';
import Navbar from './components/Navbar'; // Import Navbar
import SeriesPage from './components/series';
import SerieDetail from './components/SerieDetail';  // Correct relative path
import WatchPageSerie from './components/WatchPageSerie';
import Movies from './components/movies';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/watch/:id" element={<WatchPage />} />
      <Route path="/series" element={<SeriesPage />} />
      <Route path="/seriedetail/:id" element={<SerieDetail/>} />
      <Route path="/watchserie/:id/:season/:episode" element={<WatchPageSerie />} />
    </Routes>
  </Router> 
);

export default App;
