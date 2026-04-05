import Home from './Home'
import LNF_Result from './LNF_Result';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/home' element={<Home/>}/>  
        <Route path='/lnf_result' element={<LNF_Result/>}/>      

      </Routes>
    </BrowserRouter>
  )
}

export default App;