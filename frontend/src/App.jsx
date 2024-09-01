/* eslint-disable no-unused-vars */
import './App.css'
import { Button } from './components/ui/button'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
function App() {
  const router=createBrowserRouter(
    [
      {
        path:"/auth",
        element:<Auth/>
      },
      {
        path:"/chat",
        element:<Chat/>
      }, {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"*",
        element:<Auth/>
      }
    ]
  )
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
