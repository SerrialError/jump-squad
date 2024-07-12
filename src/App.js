import './App.css';
import Navbar from "./pages/Navbar"
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <div className="Nav">
          <Navbar/>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

