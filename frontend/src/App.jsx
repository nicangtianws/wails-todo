import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './App.css'
import TodoPage from './pages/TodoPage' 
import { Route, Routes } from 'react-router'
import SettingPage from './pages/SettingPage'
import TrashPage from './pages/TrashPage'

export default function App() {

  return (
    <>
      <Routes>
        <Route path='/' index element={<TodoPage/>}></Route>
        <Route path='/setting' element={<SettingPage/>}></Route>
        <Route path='/trash' element={<TrashPage/>}></Route>
      </Routes>
    </>
  )
}
