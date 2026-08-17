import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col text-white selection:bg-cyan-500/30 relative z-0 overflow-x-hidden bg-black">
        {/* Animated Background Mesh */}
        <div className="animated-mesh-bg">
          <div className="mesh-orb-1" />
          <div className="mesh-orb-2" />
        </div>
        
        <Navbar />
        <main className="flex-grow w-full h-full">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Catch-all fallback for other pages to show Coming Soon */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
