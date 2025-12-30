import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import MiniPostman from "./pages/MiniPostman";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/signup" index element={<SignupPage />} />
      <Route path="/test" element={<MiniPostman />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
