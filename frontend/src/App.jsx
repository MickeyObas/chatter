import { Routes, Route } from 'react-router-dom';

import './App.css';
import './index.css';
import ProtectedRoutes from './utils.jsx';

import { Register } from './pages/Register/Register';
import  { Login } from './pages/Login/Login';
import Home from './pages/Home/Home';
import EmailConfirm from './components/EmailConfirm';
import ChatMessagesSection from './components/ui/ChatMessagesSection.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Settings from './pages/Settings/Settings.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ChatProvider} from './context/ChatContext.jsx';
import Contact from './pages/Contacts/Contact.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Group from './pages/Group/Group.jsx';
import Notifications from './pages/Notification/Notifications.jsx';
import Help from './pages/Help/Help.jsx';
import Test from './components/ui/Test.jsx';


function App() {

  return (
    <AuthProvider>
      <ChatProvider>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<MainLayout />}>
              <Route path='' element={<Home />} index/>
              <Route path='contacts' element={<Contact />} />
              <Route path='profile/:userId/' element={<Profile />} />
              <Route path='test' element={<Test />} />
              <Route path='groups' element={<Group />} />
              <Route path='notifications' element={<Notifications />} />
              <Route path='help' element={<Help />} />
              <Route path='settings/profile/' element={<Profile />} />
            </Route>
          </Route>
          
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>
          <Route path='email-confirm/:token/' element={<EmailConfirm />}/>

        </Routes>
      </ChatProvider>
    </AuthProvider>
    
  )
}

export default App
