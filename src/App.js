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
import List from "./components/List"
import { AnimatePresence } from "framer-motion";
import Contact from "./components/Contact";

function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<Admin />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/list" element={<List />}></Route>
          <Route path="/*" element={<Test />}></Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
