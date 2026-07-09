import { RouterProvider } from 'react-router'
import { routes } from "./app.routes.jsx"
import './App.css'
import './theme.css'
import { ThemeProvider } from './ThemeContext.jsx'

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}

export default App
