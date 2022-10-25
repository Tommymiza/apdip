import React, { useState, useContext, useMemo } from "react";
import "../style/Home.scss";
import {
  Public,
  PermPhoneMsgRounded,
  DraftsRounded,
  HomeWorkRounded,
  VerticalAlignTopRounded,
} from "@mui/icons-material";
import Btn from "./outils/btn";
import { motion, AnimatePresence } from "framer-motion";
import { ActContext } from "../App";
import Activite from "./Activite";
import {
  Grid,
  Skeleton,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Axe } from "../firebase/axe";
import DialogAxe from "./DialogAxe";

const Home = () => {
  const { activities, pret, list, aboutloading } = useContext(ActContext);
  const [diapo, setDiapo] = useState(0);
  const [axes, setAxe] = useState();
  const skeleton = [0, 1];
  const nbGroup = useMemo(() => {
    return () => {
      if (list !== null) {
        const commune = Object.keys(list.commune);
        var nb = 0;
        for (let c of commune) {
          nb = nb + list.commune[c].groupement.length;
        }
        return [nb, commune.length];
      }
    };
  }, [list]);

  return (
    <motion.div id="accueil" exit={{opacity: 0, transition:{duration: 0.5}}}>
      <div id="title">
        <div
          style={{
            position: "absolute",
            top: "90%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
          onClick={() => {
            document
              .querySelector(".actmiss")
              .scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <Btn text="Naviguer" icon={<Public />} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "85%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100px",
            margin: 0,
          }}
        >
          <input
            type="radio"
            name="diapo"
            defaultChecked
            onChange={(e) => {
              if (e.target.checked) setDiapo(0);
            }}
          />
          <input
            type="radio"
            name="diapo"
            onChange={(e) => {
              if (e.target.checked) setDiapo(1);
            }}
          />
          <input
            type="radio"
            name="diapo"
            onChange={(e) => {
              if (e.target.checked) setDiapo(2);
            }}
          />
        </div>
        <AnimatePresence mode="wait">
          {diapo === 0 && (
            <motion.div
              key={0}
              initial={{ opacity: 0, y: 200 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ x: -1000, opacity: 0, transition: { duration: 1 } }}
              transition={{ duration: 1 }}
              style={{
                fontFamily: "var(--titre)",
                color: "white",
              }}
            >
              <h1>
                <span>A</span>ssociation des <span>P</span>aysans pour le{" "}
                <span>D</span>eveloppement <span>I</span>nter-<span>P</span>
                rofessionels
              </h1>
              <h2>
                " Tantsaha mandray andraikitra, kitro ifaharan'ny fampandrosoana
                "
              </h2>
            </motion.div>
          )}
          {diapo === 1 && (
            <motion.div
              key={1}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ x: -1000, opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.5 }}
              style={{
                display: "grid",
                placeContent: "center",
                width: "100%",
              }}
            >
              <iframe
                style={{
                  width: "80vw",
                  maxWidth: "940px",
                  height: "60vh",
                  borderRadius: "7px",
                  boxShadow: "2px 2px 15px rgb(31, 30, 30)",
                }}
                src="https://www.youtube.com/embed/Rcer_AmgqvY"
                title="SOA témoignage Lucio 2020"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          )}
          {diapo === 2 && (
            <motion.div
              key={2}
              exit={{ x: -1000, opacity: 0, transition: { duration: 1 } }}
              transition={{ duration: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "justify",
                alignSelf: "center",
              }}
            >
              {aboutloading && (
                <div className="about">
                  <div id="context">
                    <motion.h4
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                      }}
                    >
                      L'APDIP est une organisation paysanne:
                    </motion.h4>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.2,
                      }}
                    >
                      Fédérant <span>{list.paysans}</span> producteurs
                      exploitants agricoles, cotisant, répartis dans{" "}
                      <span>{nbGroup()[0]}</span> groupements de base au sein de{" "}
                      <span>{nbGroup()[1]}</span> communes rurales de la région
                      de Bongolava;
                    </motion.p>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.4,
                      }}
                    >
                      Gérée par un Conseil d’Administration composé de{" "}
                      <span>{list.ag}</span> paysans élus par l’Assemblée
                      Générale
                    </motion.p>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.6,
                      }}
                    >
                      Dotée d’une direction exécutive composée d’une Directrice,
                      <span> {list.technicien}</span> Techniciens et une
                      Secrétaire comptable
                    </motion.p>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.8,
                      }}
                    >
                      <span>{list.paysVulga}</span> Paysans Vulgarisateurs pour
                      assurer les diffusions techniques Agricoles et différents
                      services à la base
                    </motion.p>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1,
                      }}
                    >
                      <span>{list.paysRel}</span> Paysans relais pour vulgariser
                      la technique en Agro écologie aux 450 membres
                    </motion.p>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1.2,
                      }}
                    >
                      Gérant une budget annuel avec fonds propres de{" "}
                      <span>20%</span> annuel avec des audits annuels externe
                      chaque année
                    </motion.p>
                    <motion.h4
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1.5,
                      }}
                    >
                      NOTRE VISION
                    </motion.h4>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1.6,
                      }}
                    >
                      <span>Développement et Professionnalisme:</span>
                    </motion.p>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1.8,
                      }}
                    >
                      Développer le niveau de vie des paysans membres au niveau
                      maximum (IDH) et Professionnaliser les métiers agricoles.
                    </motion.p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="actmiss" style={{ minHeight: "100vh" }}>
        <div className="activity">
          <h2>Nos activités récentes:</h2>
          {pret ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              {activities.slice(-2).map((activ, index) => (
                <Activite activ={activ} key={index} accueil={true} />
              ))}
            </div>
          ) : (
            <Grid container direction={"row"} justifyContent={"space-evenly"}>
              {skeleton.map((i) => (
                <motion.div
                  key={i}
                  className="actcard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card sx={{ maxWidth: 345 }} elevation={4}>
                    <Skeleton
                      variant={"rectangular"}
                      width={345}
                      height={160}
                    ></Skeleton>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        <Skeleton
                          width={100}
                          height={20}
                          variant={"rectangular"}
                        ></Skeleton>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Skeleton
                          width={200}
                          height={10}
                          variant={"rectangular"}
                        ></Skeleton>
                        <Skeleton
                          width={200}
                          height={10}
                          variant={"rectangular"}
                        ></Skeleton>
                        <Skeleton
                          width={200}
                          height={10}
                          variant={"rectangular"}
                        ></Skeleton>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">More...</Button>
                    </CardActions>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          )}
        </div>
        <div className="mission">
          <h2>Nos missions:</h2>
          <motion.div
            initial={{ scale: 0, y: 200, opacity: 0 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: 0,
              type: "spring",
              stiffness: 50,
            }}
          >
            <p>
              <span>octroyer</span> des appuis techniques efficaces et
              efficients aux membres ( formations, suivi sur terrain, conseils
              agricole, appuis à la mise en œuvre)
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0, y: 200, opacity: 0 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: 0.2,
              type: "spring",
              stiffness: 50,
            }}
          >
            <p>
              <span>Faciliter</span> les accès et disponibilité des intrants
              bénéfiques pour les membres ( semence, vaccin, dotation jeunes)
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0, y: 200, opacity: 0 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: 0.5,
              type: "spring",
              stiffness: 50,
            }}
          >
            <p>
              <span>Privilégier</span> l’approche genre (épanouissement de la
              femme et de la famille) dans tous les secteurs de développement
            </p>
          </motion.div>
        </div>
      </div>
      <div id="footer">
        <h2>Nos Axes stratégiques 2022-2025:</h2>
        <div className="mission">
          {Axe.map((item) => (
            <motion.div
              key={item.title}
              style={{ cursor: "pointer", maxWidth: "450px" }}
              initial={{ scale: 0, y: 200, opacity: 0 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: 0,
                type: "spring",
                stiffness: 50,
              }}
              onClick={() => {
                setAxe(<DialogAxe axe={item} hide={setAxe} />);
              }}
              whileHover={{
                x: 10,
                transition: { duration: 0.2 },
              }}
            >
              <p>
                <span>Axe {item.id}: </span>
                {item.title}
              </p>
            </motion.div>
          ))}
          {axes}
        </div>
        <motion.div id="coord" initial={{opacity: 0}} whileInView={{opacity: 1}} transition={{duration: 1}}>
          <div style={{position: "absolute", top: "-20px", right: "10px"}}>
            <IconButton size="large" sx={{bgcolor: "ActiveBorder"}} onClick={()=>{
              document.getElementById("accueil").scrollIntoView({behavior: "smooth"})
            }}>
              <VerticalAlignTopRounded />
            </IconButton>
          </div>
          <div>
            <h4>Nos services:</h4>
            <ul>
              <li>-Vente des semences</li>
              <li>-Formation agricole et elevage</li>
              <li>-Vente des produits</li>
            </ul>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <PermPhoneMsgRounded />
              <p> : </p>
              <p>+261 34 68 030 98</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <DraftsRounded />
              <p> : </p>
              <p>apdiptsiro@gmail.com</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <HomeWorkRounded />
              <p> : </p>
              <p>
                Lot 06 AB 34 Soamahamanina
                <br />
                Tsiroanomandidy 119 Madagasikara
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
