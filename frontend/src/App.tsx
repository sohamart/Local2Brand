import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import './index.css';

function App() {
  const [isBootComplete, setIsBootComplete] = useState(() => window.location.pathname !== '/');

  return (
    <Router>
      <div className="min-h-screen flex flex-col text-white selection:bg-cyan-500/30 relative z-0 overflow-x-hidden bg-black">
        
        {/* Animated Background Mesh */}
        <div className="animated-mesh-bg">
          <div className="mesh-orb-1" />
          <div className="mesh-orb-2" />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isBootComplete ? 1 : 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-50 w-full"
        >
          <Navbar />
        </motion.div>

        <main className="flex-grow w-full h-full relative z-10">
          <Routes>
            <Route path="/" element={<Home isBootComplete={isBootComplete} onBootComplete={() => setIsBootComplete(true)} />} />
            {/* Catch-all fallback for other pages to show Coming Soon */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
