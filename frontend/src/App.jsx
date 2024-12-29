import { Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import { Register } from './pages/Register/Register';
import  { Login } from './pages/Login/Login';
import Home from './pages/Home/Home';
import EmailConfirm from './components/EmailConfirm';
import ProtectedRoutes from './utils.jsx';
import ChatMessagesSection from './components/ui/ChatMessagesSection.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Settings from './pages/Settings/Settings.jsx';
import { AuthProvider } from './context/AuthContext.jsx';


function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<MainLayout />}>
            <Route path='' element={<Home />} index/>
            <Route path='test' element={<ChatMessagesSection isStandalone={true}/>} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Route>
        
        <Route path='register' element={<Register />}/>
        <Route path='login' element={<Login />}/>
        <Route path='email-confirm/:token/' element={<EmailConfirm />}/>

      </Routes>
    </AuthProvider>
    
  )
}

export default App
