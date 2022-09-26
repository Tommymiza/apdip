import React, { useEffect, useState } from "react";
import fond1 from "../images/1.jpg";
import fond2 from "../images/2.jpg";
import fond3 from "../images/3.jpg";
import { Skeleton } from "@mui/material";
import * as Im from "@mui/icons-material";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { animated } from "react-spring";
import "../style/Home.scss";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./db";

const Home = () => {
  const skeleton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [pret, setPret] = useState(false);
  const [list, setList] = useState({});
  useEffect(() => {
    return () => {
      const database = getFirestore(app);
      const docs = collection(database, "apropos");
      getDocs(docs)
        .then((res) => {
          const temp = res.docs.map((doc) => {
            return doc.data();
          });
          setList(temp[0]);
          setPret(true);
        })
        .catch((err) => {
          alert(err);
        });
    };
  }, []);
  return (
    <div id="parallax">
      <Parallax pages={3}>
        <ParallaxLayer
          offset={0}
          sticky={{ start: 0, end: 1 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100vw",
              height: "100vh",
            }}
          >
            <img
              src={fond1}
              alt=""
              style={{
                position: "absolute",
                zIndex: -1,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {pret ? (
              <animated.div className="apropos">
                <p>
                  L' <span>APDIP</span> est une organisation paysanne:
                </p>
                <div>
                  <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                  <p>
                    Fédérant <span>{list.paysans} producteurs</span> exploitants
                    agricoles, cotisant, répartis dans{" "}
                    <span>{list.groupement} groupements</span> de base au sein
                    de <span>10 communes rurales</span> de la région de
                    Bongolava
                  </p>
                </div>
                <div>
                  <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                  <p>
                    Gérée par <span>un Conseil d’Administration</span> composé
                    de <span>{list.ag} paysans</span> élus par l’Assemblée
                    Générale
                  </p>
                </div>
                <div>
                  <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                  <p>
                    Dotée d’une direction exécutive composée d’une Directrice,{" "}
                    {list.technicien + " "}
                    Techniciens et 01 Secrétaire comptable
                  </p>
                </div>
                <div>
                  <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                  <p>
                    <span>{list.paysVulga} Paysans Vulgarisateurs</span> pour
                    assurer les diffusions techniques Agricoles et différents
                    services à la base.
                  </p>
                </div>
                <div>
                  <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                  <p>
                    <span>{list.paysRel} Paysans relais</span> pour vulgariser
                    la technique en Agro écologie aux 450 membres
                  </p>
                </div>
                <div>
                  <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                  <p>
                    Gérant une budget annuel avec fonds propres de{" "}
                    <span>20% annuel</span> avec des audits annuels externe
                    chaque année.
                  </p>
                </div>
                <div className="column">
                  <h2>Notre Vision:</h2>
                  <p>
                    <span>Développement et Professionnalisme</span>
                  </p>
                  <p>
                    Développer le niveau de vie des paysans membres au niveau
                    maximum (IDH) et Professionnaliser les métiers agricoles.
                  </p>
                </div>
              </animated.div>
            ) : (
              <div className="apropos">
                <Skeleton
                  variant="rounded"
                  width={"30%"}
                  height={40}
                ></Skeleton>
                {skeleton.map((key) => (
                  <div key={key}>
                    <Skeleton
                      variant="rounded"
                      width={"100%"}
                      height={20}
                    ></Skeleton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={1} sticky={{ start: 1, end: 2.5 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100vw",
              height: "100vh",
            }}
          >
            <img
              src={fond2}
              alt=""
              style={{
                position: "absolute",
                zIndex: -1,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div className="contenu">
              <animated.div>Activité et Mission</animated.div>
            </div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={2} sticky={{ start: 2.5, end: 3 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100vw",
              height: "100vh",
            }}
          >
            <img
              src={fond3}
              alt=""
              style={{
                position: "absolute",
                zIndex: -1,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div className="footer">
              <h1>Footer</h1>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Home;
