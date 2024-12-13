import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/home'; 
import Register from './components/register';
import MovieDetail from './components/MovieDetail';
import WatchPage from './components/WatchPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/watch/:id" element={<WatchPage />} />
    </Routes>
  </Router>
);

export default App;
