import { Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

// Use React.lazy for dynamic imports
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <div className="p-4 h-screen flex justify-center items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </>
  );
}

export default App;
