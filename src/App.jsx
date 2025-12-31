import { Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import MiniPostman from "./pages/MiniPostman";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import PrivateRouteHandler from "./components/PrivateRouteHandler";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" index element={<SignupPage />} />
        <Route path="/test" element={<MiniPostman />} />
        <Route
          path="/minipostman"
          element={
            <PrivateRouteHandler>
              <Home />
            </PrivateRouteHandler>
          }
        />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
