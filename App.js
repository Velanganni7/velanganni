import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import Player from './Component/Player';
import Signup from './Component/Signup';
import MoodManager from './Component/MoodManager';
import AddSong from './Component/AddSong';

function App() {

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/player' element={<Player/>}></Route>
          <Route path='/moods' element={<MoodManager/>}></Route>
          <Route path='/songs' element={<AddSong/>}></Route>
          

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;