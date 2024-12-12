import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/home'; 
import Register from './components/register';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;
