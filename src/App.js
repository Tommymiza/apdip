import Navbar from "./components/Navbar";
import "./style/App.scss";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Test from "./components/test";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/list" element={<Admin />}></Route>
          <Route path="/*" element={<Test />}></Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
