import React, { useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "../style/leaflet.css";
import { about } from "../firebase/about";
import Commune from "./Commune";
import "../style/carte.scss";

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
    const abt = about.getPostInstance();
    abt.getCommune(setCommune);
  }, []);
  useEffect(() => {
    const key = Object.keys(commune);
    setKeycommune(key);
  }, [commune]);
  const center = [-18.785816, 46.049612];
  return (
    <>
      <MapContainer center={center} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>Apdip Tsiroanomandidy</Popup>
        </Marker>
        {keyCommune.map((item) => (
          <Marker
            key={item}
            position={[commune[item].right, commune[item].top]}
            eventHandlers={{
              dblclick() {
                showDialog(item, commune[item].groupement);
              },
            }}
          >
            <Popup>{item}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {dialog}
    </>
  );
};

export default Carte;
