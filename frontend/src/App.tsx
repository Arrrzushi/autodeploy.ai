import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analysis from './pages/Analysis';
import Deploy from './pages/Deploy';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/deploy" element={<Deploy />} />
          <Route path="/dashboard/:deploymentId" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



