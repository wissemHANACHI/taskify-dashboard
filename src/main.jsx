import { StrictMode } from 'react'
 import { createRoot } from 'react-dom/client' 
 import './index.css'
  import TaskifyDashboard from './TaskifyDashboard' 
  createRoot(document.getElementById('root')).render( <StrictMode> <TaskifyDashboard /> </StrictMode>, )
  