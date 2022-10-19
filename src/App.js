import Navbar from "./components/Navbar";
import React, { useState, useEffect, createContext } from "react";
import "./style/App.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Test from "./components/test";
import List from "./components/List";
import { AnimatePresence } from "framer-motion";
import Contact from "./components/Contact";
import Partenaire from "./components/Partenaire";
import { activity } from "./firebase/activite";
import { about } from "./firebase/about";

export const ActContext = createContext();
function App() {
  const location = useLocation();
  const [activities, setActivities] = useState();
  const [pret, setPret] = useState(false);
  const [aboutloading, setAboutloading] = useState(false);
  const [list, setList] = useState({});

  useEffect(() => {
    return () => {
      const act = activity.getPostInstance();
      const abt = about.getPostInstance();
      act.list(setActivities).then(() => {
        setPret(true);
      });
      abt.getdocument(setList).then(() => {
        setAboutloading(true)
      });
    };
  }, []);
  return (
    <>
      <Navbar />
      <ActContext.Provider
        value={{
          activities,
          pret,
          list,
          aboutloading,
          setActivities,
          setList,
        }}
      >
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/dashboard" element={<Admin />}></Route>
            <Route path="/list" element={<List />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/partenaire" element={<Partenaire />}></Route>
            <Route path="/*" element={<Test />}></Route>
          </Routes>
        </AnimatePresence>
      </ActContext.Provider>
    </>
  );
}

export default App;
