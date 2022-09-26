import Navbar from "./components/Navbar";
import "./style/App.scss";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Test from "./components/test";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/list" element={<Admin/>}></Route>
        <Route path="/test" element={<Test/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
