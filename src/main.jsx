import React from 'react'
import ReactDOM from 'react-dom/client'
// import {Provider} from "react-redux";
import App from './App.jsx'
import Post from "./pages/Post.jsx"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import './index.css'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      // <Provider store={appStore}>
      <Outlet />
      // </Provider>
    ),
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "/post/:postId",
        element: <Post />
      },
      // {
      //   path: "/login",
      //   element: <Login />
      // },
      // {
      //   path:"/signup",
      //   element: <Signup />
      // }
    ]
  }
])



const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<RouterProvider router={appRouter} />)


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
