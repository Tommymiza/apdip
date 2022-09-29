import React, { useEffect, useState } from "react";
import fond1 from "../images/graphic-node-dm-9lIgr_K0-unsplash.jpg";
import {
  Skeleton,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  Avatar,
} from "@mui/material";
import * as Im from "@mui/icons-material";
import "../style/Home.scss";
import { motion } from "framer-motion";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import app from "./db";

const Home = () => {
  const skeleton = [0, 1, 2, 3, 4, 5, 6];
  const [pret, setPret] = useState(false);
  const [list, setList] = useState({});
  const [activities, setActivities] = useState([]);
  const [show, setShow] = useState({});

  function showDialog(id) {
    const obj = {};
    Object.keys(show).forEach((key) => {
      if (key === id) {
        obj[key] = true;
      } else {
        obj[key] = false;
      }
    });
    setShow(obj);
  }
  function hideDialog() {
    const temp = {};
    Object.keys(show).forEach((key) => {
      temp[key] = false;
    });
    setShow(temp);
  }

  useEffect(() => {
    return () => {
      const database = getFirestore(app);
      const docs = collection(database, "apropos");
      getDocs(docs)
        .then((res) => {
          const temp = res.docs.map((doc) => doc.data());
          setList(temp[0]);
          setPret(true);
        })
        .catch((err) => {
          alert(err);
        });
      const activity = collection(database, "activity");
      getDocs(activity).then((resultat) => {
        const temp = {};
        resultat.docs.forEach((item) => {
          const date = item.data().date.toDate();
          const exactpath =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate() +
            "/" +
            item.data().path;
          temp[item.id] = false;
          getDownloadURL(ref(getStorage(app), `images/${exactpath}`)).then(
            (res) => {
              setActivities((previous) => [
                ...previous,
                {
                  id: item.id,
                  date: item.data().date.toDate(),
                  description: item.data().description,
                  path: res,
                  title: item.data().title,
                },
              ]);
            }
          );
        });
        setShow(temp);
      });
    };
  }, []);
  return (
    <div className="accueil">
      <Avatar
        src="images/logo_APDIP.png"
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "50vh",
          height: "50vh",
          position: "fixed",
          opacity: 0.7,
          zIndex: -1,
        }}
      ></Avatar>
      <header>
        <div id="apropos">
          {pret ? (
            <div>
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0 }}
              >
                L' <span>APDIP</span> est une organisation paysanne:
              </motion.p>
              <motion.div
                className="icontext"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                <p>
                  Fédérant <span>{list.paysans} producteurs</span> exploitants
                  agricoles, cotisant, répartis dans{" "}
                  <span>{list.groupement} groupements</span> de base au sein de{" "}
                  <span>{list.commune.length} communes rurales</span> de la
                  région de Bongolava
                </p>
              </motion.div>
              <motion.div
                className="icontext"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                <p>
                  Gérée par <span>un Conseil d’Administration</span> composé de{" "}
                  <span>{list.ag} paysans</span> élus par l’Assemblée Générale
                </p>
              </motion.div>
              <motion.div
                className="icontext"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                <p>
                  Dotée d’une direction exécutive composée d’une Directrice,{" "}
                  {list.technicien + " "}
                  Techniciens et 01 Secrétaire comptable
                </p>
              </motion.div>
              <motion.div
                className="icontext"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                <p>
                  <span>{list.paysVulga} Paysans Vulgarisateurs</span> pour
                  assurer les diffusions techniques Agricoles et différents
                  services à la base.
                </p>
              </motion.div>
              <motion.div
                className="icontext"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.3 }}
              >
                <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                <p>
                  <span>{list.paysRel} Paysans relais</span> pour vulgariser la
                  technique en Agro écologie aux 450 membres
                </p>
              </motion.div>
              <motion.div
                className="icontext"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <Im.Check sx={{ fontSize: 30, color: "white", mr: 2 }} />
                <p>
                  Gérant une budget annuel avec fonds propres de{" "}
                  <span>20% annuel</span> avec des audits annuels externe chaque
                  année.
                </p>
              </motion.div>
              <motion.div
                className="column"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.8 }}
              >
                <h2>Notre Vision:</h2>
                <p>
                  <span>Développement et Professionnalisme</span>
                </p>
                <p>
                  Développer le niveau de vie des paysans membres au niveau
                  maximum (IDH) et Professionnaliser les métiers agricoles.
                </p>
              </motion.div>
            </div>
          ) : (
            <div>
              <Skeleton
                variant="rounded"
                width={"60%"}
                height={60}
                sx={{ my: 2 }}
              ></Skeleton>
              {skeleton.map((i) => (
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={40}
                  key={i}
                  sx={{ my: 2 }}
                ></Skeleton>
              ))}
            </div>
          )}
        </div>
      </header>
      <section>
        <div className="actmiss">
          <div className="activity">
            {activities.length !== 0 ? (
              <Grid
                container
                direction={"row"}
                wrap={"wrap"}
                justifyContent={"space-evenly"}
                display={"flex"}
              >
                {activities.map((activ, index) => (
                  <div key={index} className="actcard">
                    <Card sx={{ maxWidth: 345 }} elevation={4}>
                      <CardMedia
                        component="img"
                        sx={{ width: 345, height: 140 }}
                        image={activ.path}
                        alt={activ.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {activ.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activ.description.substr(0, 30) + "..."}
                        </Typography>
                        <Dialog open={show[activ.id]}>
                          <DialogTitle>{activ.title}</DialogTitle>
                          <Button
                            variant="rounded"
                            onClick={() => hideDialog()}
                          >
                            Close
                          </Button>
                        </Dialog>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => showDialog(activ.id)}
                        >
                          More...
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                ))}
              </Grid>
            ) : (
              <Grid container direction={"row"} justifyContent={"space-evenly"}>
                {skeleton.map((i) => (
                  <motion.div key={i} className="actcard" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
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
          <div className="mission"></div>
        </div>
      </section>
    </div>
  );
};
export default Home;
