import { RouterProvider } from 'react-router'
import { routes } from "./app.routes.jsx"
import { useEffect } from 'react'
import {useAuth} from "../features/auth/hooks/use.auth.js"
import './App.css'
import './theme.css'
import { ThemeProvider } from './ThemeContext.jsx'

function App() {
  const {getMeHandle} = useAuth()
  useEffect(()=>{
    getMeHandle()
  },[])
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}

export default App
