import './App.css';
import Navbar from "./pages/Navbar"
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="Nav">
        <Navbar/>
      </div>
    </AuthProvider>
  );
}


export default App;
