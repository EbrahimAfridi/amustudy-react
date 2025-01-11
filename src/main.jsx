import ReactDOM from 'react-dom/client'
// import {Provider} from "react-redux";
import App from './App.jsx';
import Post from "./pages/Post/Post.jsx";
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import { UserProvider } from "./utils/UserContext";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import './index.css'
import NewFormPage from './pages/formpage.jsx';

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
      {
        path: "/login",
        element: <Login />
      },
      {
        path:"/signup",
        element: <Signup />
      },
      {
        path:"/new",
        element:<NewFormPage />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
])



const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <UserProvider>
      {/* <DarkModeProvider> */}
          <RouterProvider router={appRouter}/>
      {/* </DarkModeProvider> */}
  </UserProvider>
  );
