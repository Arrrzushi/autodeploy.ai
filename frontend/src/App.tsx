import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analysis from './pages/Analysis';
import Deploy from './pages/Deploy';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bgDark">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/deploy" element={<Deploy />} />
          <Route path="/dashboard/:deploymentId" element={<Dashboard />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



