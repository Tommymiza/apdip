import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import "../style/Home.scss";
import { AnimatePresence, motion } from "framer-motion";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import app from "./db";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

const Home = () => {
  const skeleton = [0, 1];
  const [pret, setPret] = useState(false);
  const [list, setList] = useState({});
  const [activities, setActivities] = useState([]);
  const [show, setShow] = useState({});
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(document.body.offsetWidth);

  function upScroll() {
    var temp = page - 1;
    if (temp === -1) {
      temp = 0
    }
    setPage(temp);
  }
  function downScroll() {
    var temp = page + 1;
    if (temp === 3) {
      temp = 2
    }
    setPage(temp);
  }

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
          return;
        });
      const activity = collection(database, "activity");
      getDocs(activity)
        .then((resultat) => {
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
            getDownloadURL(ref(getStorage(app), `images/${exactpath}`))
              .then((res) => {
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
              })
              .catch((err) => {
                alert(err);
              });
          });
          setShow(temp);
        })
        .catch((err) => {
          alert(err);
        });
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
      });
    };
  }, []);
  return width >= 1590 ? (
    <ReactScrollWheelHandler
      upHandler={upScroll}
      downHandler={downScroll}
    >
      <motion.div className="accueil" 
      exit={{opacity: 0, transition:{duration: 0.5}}}>
        <AnimatePresence mode="wait">
          {page === 0 && (
            <motion.section
              className="large"
              initial={{ opacity: 0, x: 1000 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
              exit={{
                opacity: 0,
                x: -1000,
              }}
              transition={{ duration: 1 }}
              key={page}
            >
              <div className="about">
                <h2>About</h2>
              </div>
            </motion.section>
          )}
          {page === 1 && (
            <motion.section
              className="large"
              initial={{ opacity: 0, x: 1000 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
              exit={{
                opacity: 0,
                x: -1000,
              }}
              transition={{ duration: 1 }}
              key={page}
            >
              <div className="actmiss">
                <div className="activity">
                  <h1>Nos activités récentes:</h1>
                  {activities.length !== 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                      }}
                    >
                      {activities.map((activ, index) => (
                        <motion.div
                          key={index}
                          className="actcard"
                          initial={{ scale: 0, y: 200, opacity: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 50,
                          }}
                        >
                          <Card
                            sx={{
                              maxWidth: 345,
                              bgcolor: "transparent",
                              backdropFilter: "blur(3px)",
                              boxShadow: "2px 2px 15px #6091A5",
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{ width: 345, height: 160 }}
                              image={activ.path}
                              alt={activ.title}
                            />
                            <CardContent sx={{ bgcolor: "transparent" }}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {activ.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
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
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Grid
                      container
                      direction={"row"}
                      justifyContent={"space-evenly"}
                    >
                      {skeleton.map((i) => (
                        <motion.div
                          key={i}
                          className="actcard"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Card sx={{ maxWidth: 345 }} elevation={4}>
                            <Skeleton
                              variant={"rectangular"}
                              width={345}
                              height={160}
                            ></Skeleton>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                <Skeleton
                                  width={100}
                                  height={20}
                                  variant={"rectangular"}
                                ></Skeleton>
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
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
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0,
                      type: "spring",
                      stiffness: 50,
                    }}
                  >
                    <p>
                      <span>octroyer</span> des appuis techniques efficaces et
                      efficients aux membres ( formations, suivi sur terrain,
                      conseils agricole, appuis à la mise en œuvre)
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, y: 200, opacity: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 50,
                    }}
                  >
                    <p>
                      <span>Faciliter</span> les accès et disponibilité des
                      intrants bénéfiques pour les membres ( semence, vaccin,
                      dotation jeunes)
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, y: 200, opacity: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5,
                      type: "spring",
                      stiffness: 50,
                    }}
                  >
                    <p>
                      <span>Privilégier</span> l’approche genre (épanouissement
                      de la femme et de la famille) dans tous les secteurs de
                      développement
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}
          {page === 2 && (
            <motion.section
              className="large"
              initial={{ opacity: 0, x: 1000 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
              exit={{
                opacity: 0,
                x: -1000,
              }}
              transition={{ duration: 1 }}
              key={page}
            >
              <div>Footer</div>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </ReactScrollWheelHandler>
  ) : (
    <motion.div className="accueil" exit={{opacity: 0, transition:{duration: 0.5}}}>
      <motion.section
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <div className="about"><h2>About</h2></div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 200 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 1 }}
      >
        <div className="actmiss">
          <div className="activity">
            <h1>Nos activités récentes:</h1>
            {activities.length !== 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                }}
              >
                {activities.map((activ, index) => (
                  <motion.div
                    key={index}
                    className="actcard"
                    initial={{ scale: 0, y: 200, opacity: 0 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 50,
                    }}
                  >
                    <Card
                      sx={{
                        maxWidth: 345,
                        bgcolor: "transparent",
                        backdropFilter: "blur(3px)",
                        boxShadow: "2px 2px 15px #6091A5",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 345, height: 160 }}
                        image={activ.path}
                        alt={activ.title}
                      />
                      <CardContent sx={{ bgcolor: "transparent" }}>
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <Grid container direction={"row"} justifyContent={"space-evenly"}>
                {skeleton.map((i) => (
                  <motion.div
                    key={i}
                    className="actcard"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
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
                duration: 0.8,
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
                duration: 0.8,
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
                duration: 0.8,
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
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 200 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 1 }}
      >
        <div>Footer</div>
      </motion.section>
    </motion.div>
  );
};
export default Home;
