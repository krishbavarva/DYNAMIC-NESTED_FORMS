import './App.css';
import DynamicBundleForm from './Components/Dynamic-field';
import MultiTabForm from './Components/Multi-step-from';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AdvancedValidationForm from './Components/Cross-field';
import ComplexOrderForm from './Components/Nested-field';

function App() {
  return (
   <>
   <Router>
      <Navbar/>
    <Routes>
      <Route path='/' element={<MultiTabForm/>} />
      <Route path='/dynamic' element={<DynamicBundleForm/>} />
      <Route path='/advancevalidation' element={<AdvancedValidationForm/>} />
      <Route path='/nested' element={<ComplexOrderForm/>} />
    </Routes>
   </Router>
   </>
  );
}

export default App;
//hello main branch
