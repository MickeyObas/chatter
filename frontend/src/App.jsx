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
import Groups from './pages/Groups/Groups.jsx';
import Notifications from './pages/Notification/Notifications.jsx';
import Help from './pages/Help/Help.jsx';
import Test from './components/ui/Test.jsx';
import { OnlineContactsProvider } from './context/OnlineContactsContext.jsx';
import { ContactProvider } from './context/ContactContext.jsx';
import Group from './pages/Group/Group.jsx';




function App() {

  return (
    <AuthProvider>
      <Routes>

      {/* Public Routes */}
      <Route path='register' element={<Register />}/>
      <Route path='login' element={<Login />}/>
      <Route path='email-confirm/:token/' element={<EmailConfirm />}/>

      {/* Private Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={
            <ContactProvider>
              <OnlineContactsProvider>
                <ChatProvider>
                  <MainLayout />
                </ChatProvider>
              </OnlineContactsProvider>
            </ContactProvider>
          }>
            <Route path='' element={<Home />} index/>
            <Route path='contacts' element={<Contact />} />
            <Route path='profile/:userId/' element={<Profile />} />
            <Route path='test' element={<Test />} />
            <Route path='groups' element={<Groups />} />
            <Route path='groups/:groupId/' element={<Group />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='help' element={<Help />} />
            <Route path='settings/profile/' element={<Profile />} />
          </Route>
        </Route>

      </Routes>
    </AuthProvider>
    
  )
}

export default App
