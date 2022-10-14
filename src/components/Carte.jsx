import React, { useState, useEffect } from "react";
import { Tooltip, Icon } from "@mui/material";
import { PlaceRounded, ApartmentRounded } from "@mui/icons-material";
import { about } from "../firebase/about";
import Commune from "./Commune";
import { motion } from "framer-motion";

const Carte = () => {
  const [commune, setCommune] = useState({});
  const [keyCommune, setKeycommune] = useState([]);
  const [dialog, setDialog] = useState();
  function showDialog(commune, groupement) {
    setDialog(
      <Commune commune={commune} groupement={groupement} set={setDialog} />
    );
  }
  useEffect(() => {
    const abt = about.getpostinstance();
    return () => {
      abt.getCommune(setCommune);
    };
  }, []);
  useEffect(() => {
    const key = Object.keys(commune);
    setKeycommune(key);
  }, [commune]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 50 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <div id="carte">
        <img src="./images/Bongolava.png" alt="" />
        <Tooltip
          title="APDIP Tsiroanomandidy"
          sx={{
            position: "absolute",
            top: "50%",
            right: "63%",
            cursor: "pointer",
          }}
        >
          <Icon fontSize="large">
            <ApartmentRounded sx={{ fontSize: 40 }} htmlColor="red" />
          </Icon>
        </Tooltip>
        {keyCommune.length !== 0 &&
          keyCommune.map((item) => (
            <Tooltip
              key={item}
              title={item}
              sx={{
                position: "absolute",
                top: `${commune[item].top}%`,
                right: `${commune[item].right}%`,
                cursor: "pointer",
              }}
              onClick={() => {
                showDialog(item, commune[item].groupement);
              }}
            >
              <Icon fontSize="large">
                <PlaceRounded sx={{ fontSize: 40 }} htmlColor="white" />
              </Icon>
            </Tooltip>
          ))}
      </div>
      {dialog && dialog}
    </motion.div>
  );
};

export default Carte;
