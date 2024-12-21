import { Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import { Register } from './pages/Register/Register';
import  { Login } from './pages/Login/Login';
import Home from './pages/Home/Home';
import EmailConfirm from './components/EmailConfirm';


function App() {

  return (
    <Routes>
      
      <Route path='/'>
        <Route path='' element={<Home />} />
        <Route path='register' element={<Register />}/>
        <Route path='login' element={<Login />}/>
        <Route path='email-confirm/:token/' element={<EmailConfirm />}/>
      </Route>

    </Routes>
  )
}

export default App
