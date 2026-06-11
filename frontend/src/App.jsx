import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FloatingCards from './components/FloatingCards';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar onEnter={() => navigate('/app')} />
      <Hero onExplore={() => navigate('/app')} />
      <FloatingCards />
    </>
  );
}

export default App;