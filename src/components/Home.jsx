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
  IconButton,
} from "@mui/material";
import {
  Close,
  ChevronLeftRounded,
  ChevronRightRounded,
  Translate,
} from "@mui/icons-material";
import "../style/Home.scss";
import { AnimatePresence, motion } from "framer-motion";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
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
  const [slide, setSlide] = useState(0);

  const slideleft = (a) => {
    if (slide > -((a - 1) * 100)) {
      var trsltX = slide - 100;
      setSlide(trsltX);
    }
  };
  const slideright = () => {
    if (slide < 0) {
      var trsltX = slide + 100;
      setSlide(trsltX);
    }
  };

  function upScroll() {
    var temp = page - 1;
    if (temp === -1) {
      temp = 0;
    }
    setPage(temp);
  }
  function downScroll() {
    var temp = page + 1;
    if (temp === 3) {
      temp = 2;
    }
    setPage(temp);
  }

  function showDialog(id) {
    setSlide(0);
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

  const database = getFirestore(app);
  async function getdocument(str) {
    const docs = collection(database, str);
    const document = await getDocs(docs);
    var act = [];
    document.docs.map((item) => {
      act = [...act, { id: item.id, contenu: item.data() }];
    });
    return act;
  }
  async function querydoc(str) {
    const activity = collection(database, str);
    const q = query(activity, orderBy("date", "desc"), limit(2));
    const document = await getDocs(q);
    var act = [];
    document.docs.map((item) => {
      act = [...act, { id: item.id, contenu: item.data() }];
    });
    return act;
  }
  async function downurl(str) {
    const storage = getStorage(app);
    const refStorage = ref(storage, str);
    const download = await getDownloadURL(refStorage);
    return download;
  }
  async function demarrer() {
    const activity = await querydoc("activity");
    const temp = {};
    for (let act of activity) {
      var tab = [];
      for (let img of act.contenu.images) {
        const path =
          "images/" +
          act.contenu.title +
          act.contenu.place +
          act.contenu.date +
          "/" +
          img;
        const downloadedurl = await downurl(path);
        tab.push(downloadedurl);
      }
      temp[act.id] = false;
      setActivities((prev) => [
        ...prev,
        {
          id: act.id,
          date: act.contenu.date,
          description: act.contenu.description,
          images: tab,
          place: act.contenu.place,
          title: act.contenu.title,
        },
      ]);
    }
    setShow(temp);
  }
  useEffect(() => {
    document.querySelectorAll(".diapo div").forEach((element) => {
      element.style.transform = `translateX(${slide}%)`;
    });
  }, [slide]);
  useEffect(() => {
    return () => {
      setPret(false);
      demarrer().then((res) => {
        setPret(true);
      });
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
      });
    };
  }, []);
  return width >= 1590 ? (
    <ReactScrollWheelHandler upHandler={upScroll} downHandler={downScroll}>
      <motion.div
        className="accueil"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
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
              transition={{ duration: 0.5 }}
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
              transition={{ duration: 0.5 }}
              key={page}
            >
              <div className="actmiss">
                <div className="activity">
                  <h1>Nos activités récentes:</h1>
                  {pret ? (
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
                            duration: 0.2,
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
                              image={activ.images[0] || "images/logo_APDIP.png"}
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
                              <Dialog
                                open={show[activ.id]}
                                maxWidth={"lg"}
                                onBackdropClick={hideDialog}
                              >
                                <div className="diaporama">
                                  <div className="diapo">
                                    {activ.images.map((item, index) => (
                                      <div key={index}>
                                        <img src={item} alt={activ.title} />
                                      </div>
                                    ))}
                                    <IconButton
                                      onClick={() => slideright()}
                                      sx={{
                                        position: "absolute",
                                        left: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                      }}
                                    >
                                      <ChevronLeftRounded />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        slideleft(activ.images.length)
                                      }
                                      sx={{
                                        position: "absolute",
                                        right: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                      }}
                                    >
                                      <ChevronRightRounded />
                                    </IconButton>
                                  </div>
                                  <div className="descri">
                                    <h2>{activ.title}</h2>
                                    <h4>
                                      {activ.place} le {activ.date}
                                    </h4>
                                    <p>{activ.description}</p>
                                  </div>
                                  <IconButton
                                    sx={{
                                      position: "absolute",
                                      right: 0,
                                      top: 0,
                                    }}
                                    onClick={hideDialog}
                                  >
                                    <Close />
                                  </IconButton>
                                </div>
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
                          transition={{ duration: 0.2 }}
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
                      duration: 0.2,
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
                      duration: 0.2,
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
                      duration: 0.2,
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
    <motion.div
      className="accueil"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.section
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <div className="about">
          <h2>About</h2>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 200 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.5 }}
      >
        <div className="actmiss">
          <div className="activity">
            <h1>Nos activités récentes:</h1>
            {pret ? (
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
                        image={activ.images[0] || "images/logo_APDIP.png"}
                        alt={activ.title}
                      />
                      <CardContent sx={{ bgcolor: "transparent" }}>
                        <Typography gutterBottom variant="h5" component="div">
                          {activ.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activ.description.substr(0, 30) + "..."}
                        </Typography>
                        <Dialog
                          open={show[activ.id]}
                          maxWidth={"lg"}
                          onBackdropClick={hideDialog}
                        >
                          <div className="diaporama">
                            <div className="diapo">
                              {activ.images.map((item, index) => (
                                <div key={index}>
                                  <img src={item} alt={activ.title} />
                                </div>
                              ))}
                              <IconButton
                                onClick={() => slideright()}
                                sx={{
                                  position: "absolute",
                                  left: 10,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }}
                              >
                                <ChevronLeftRounded />
                              </IconButton>
                              <IconButton
                                onClick={() => slideleft(activ.images.length)}
                                sx={{
                                  position: "absolute",
                                  right: 10,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }}
                              >
                                <ChevronRightRounded />
                              </IconButton>
                            </div>
                            <div className="descri">
                              <h2>{activ.title}</h2>
                              <h4>
                                {activ.place} le {activ.date}
                              </h4>
                              <p>{activ.description}</p>
                            </div>
                            <IconButton
                              sx={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                              }}
                              onClick={hideDialog}
                            >
                              <Close />
                            </IconButton>
                          </div>
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
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 200 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.5 }}
      >
        <div>Footer</div>
      </motion.section>
    </motion.div>
  );
};
export default Home;
