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
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  ChevronLeftRounded,
  ChevronRightRounded,
} from "@mui/icons-material";
import "../style/Home.scss";
import { AnimatePresence, motion } from "framer-motion";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import { activity } from "../firebase/activite";
import { about } from "../firebase/about";
import { Box } from "@mui/system";

const Home = () => {
  const skeleton = [0, 1];
  const [pret, setPret] = useState(false);
  const [activities, setActivities] = useState([]);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [list, setList] = useState({});
  const [show, setShow] = useState({});
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [slide, setSlide] = useState(0);

  const slideleft = (a) => {
    if (slide > -((a - 1) * 100)) {
      var trsltX = slide - 100;
      setSlide(trsltX);
      document.querySelectorAll(".diapo div").forEach((element) => {
        element.style.transform = `translateX(${trsltX}%)`;
      });
    }
  };
  const slideright = () => {
    if (slide < 0) {
      var trsltX = slide + 100;
      setSlide(trsltX);
      document.querySelectorAll(".diapo div").forEach((element) => {
        element.style.transform = `translateX(${trsltX}%)`;
      });
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
  function nbGroup() {
    const commune = Object.keys(list.commune);
    var nb = 0;
    for (let c of commune) {
      nb = nb + list.commune[c].groupement.length;
    }
    
    return [nb, commune.length];
  }

  useEffect(() => {
    return () => {
      setPret(false);
      const act = activity.getPostInstance();
      act.demarrer(setActivities, setShow).then(() => {
        setPret(true);
      });
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
      });
      const abt = about.getpostinstance();
      abt.getdocument(setList).then(() => {
        setAboutLoading(false);
      });
    };
  }, []);

  return width >= 1360 ? (
    <ReactScrollWheelHandler
      upHandler={upScroll}
      downHandler={downScroll}
      disableSwipeWithMouse
    >
      <motion.div
        className="accueil"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <AnimatePresence mode="wait">
          {page === 0 &&
            (!aboutLoading ? (
              <motion.section
                className="large"
                exit={{
                  opacity: 0,
                  x: -1000,
                }}
                transition={{ duration: 0.5 }}
                key={page}
              >
                <div className="about">
                  <motion.div
                    id="title"
                    initial={{ scale: 0, y: 20, opacity: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 50,
                      duration: 0.5,
                    }}
                    style={{ marginTop: "70px" }}
                  >
                    <h1>A</h1>
                    <p>ssociation des </p>
                    <h1>&nbsp;P</h1>
                    <p>aysans pour le </p>
                    <h1>&nbsp;D</h1>
                    <p>éveloppement </p>
                    <h1>&nbsp;I</h1>
                    <p>nter-</p>
                    <h1>P</h1>
                    <p>rofessionnels</p>
                  </motion.div>
                  <div id="context">
                    <motion.h4
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                      }}
                    >
                      L'APDIP est une organisation paysanne:
                    </motion.h4>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1.5,
                      }}
                    >
                      NOTRE VISION
                    </motion.h4>
                    <motion.p
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 1.6,
                      }}
                    >
                      Développement et Professionnalisme Développer le niveau de
                      vie des paysans membres au niveau maximum (IDH) et
                      Professionnaliser les métiers agricoles.
                    </motion.p>
                  </div>
                </div>
              </motion.section>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  size={100}
                  sx={{ color: "#eca588" }}
                ></CircularProgress>
              </Box>
            ))}
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
                              maxWidth: width > 1590 ? 345 : 260,
                              bgcolor: "transparent",
                              backdropFilter: "blur(3px)",
                              boxShadow: "2px 2px 15px #6091A5",
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                width: width > 1590 ? 345 : 260,
                                height: 160,
                                objectFit: "cover",
                              }}
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
                                sx={{ background: "transparent" }}
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
                                        zIndex: 1,
                                        color: "black",
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
                                        zIndex: 1,
                                        color: "black",
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
                              width={width > 1590 ? 345 : 260}
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
      {!aboutLoading ? (
        <motion.section
          className="large"
          exit={{
            opacity: 0,
            x: -1000,
          }}
          transition={{ duration: 0.5 }}
          key={page}
        >
          <div className="about">
            <motion.div
              id="title"
              initial={{ scale: 0, y: 20, opacity: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 50,
                duration: 0.5,
              }}
              style={{ marginTop: "70px" }}
            >
              <h1>A</h1>
              <p>ssociation des </p>
              <h1>&nbsp;P</h1>
              <p>aysans pour le </p>
              <h1>&nbsp;D</h1>
              <p>éveloppement </p>
              <h1>&nbsp;I</h1>
              <p>nter-</p>
              <h1>P</h1>
              <p>rofessionnels</p>
            </motion.div>
            <div id="context">
              <motion.h4
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                }}
              >
                L'APDIP est une organisation paysanne:
              </motion.h4>
              <motion.p
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                }}
              >
                Fédérant <span>{list.paysans}</span> producteurs exploitants
                agricoles, cotisant, répartis dans <span>{nbGroup()[0]}</span>{" "}
                groupements de base au sein de <span>{nbGroup()[1]}</span>{" "}
                communes rurales de la région de Bongolava;
              </motion.p>
              <motion.p
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
              >
                Gérée par un Conseil d’Administration composé de{" "}
                <span>{list.ag}</span> paysans élus par l’Assemblée Générale
              </motion.p>
              <motion.p
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                }}
              >
                Dotée d’une direction exécutive composée d’une Directrice,
                <span> {list.technicien}</span> Techniciens et une Secrétaire
                comptable
              </motion.p>
              <motion.p
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 1,
                }}
              >
                <span>{list.paysRel}</span> Paysans relais pour vulgariser la
                technique en Agro écologie aux 450 membres
              </motion.p>
              <motion.p
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 1.2,
                }}
              >
                Gérant une budget annuel avec fonds propres de <span>20%</span>{" "}
                annuel avec des audits annuels externe chaque année
              </motion.p>
              <motion.h4
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 1.5,
                }}
              >
                NOTRE VISION
              </motion.h4>
              <motion.p
                initial={{ y: 200, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 1.6,
                }}
              >
                Développement et Professionnalisme Développer le niveau de vie
                des paysans membres au niveau maximum (IDH) et Professionnaliser
                les métiers agricoles.
              </motion.p>
            </div>
          </div>
        </motion.section>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress
            size={100}
            sx={{ color: "#eca588" }}
          ></CircularProgress>
        </Box>
      )}
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
                                  zIndex: 1,
                                  color: "black",
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
                                  zIndex: 1,
                                  color: "black",
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
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.5 }}
      >
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          totam impedit unde tempore? Fugiat fugit quia minima obcaecati,
          repellendus aliquid neque laborum, doloremque aliquam magni, placeat
          praesentium voluptatum possimus sapiente molestias! Sit nobis quos
          adipisci minima possimus architecto autem recusandae corrupti sint
          dicta earum temporibus, at veniam! In ipsam voluptatibus eveniet.
          Dolorum distinctio earum dignissimos exercitationem, asperiores
          repellendus. Animi quidem eligendi sed laudantium dolore quia
          voluptates laboriosam possimus accusamus, quam unde doloribus
          architecto, molestias quas ducimus officia a voluptate ex ullam autem
          amet quis enim. Molestias error, minima eaque tempore quasi quos
          omnis, veritatis, necessitatibus hic nemo excepturi. Odio unde quasi
          aperiam quam laudantium reprehenderit nulla fuga iure dicta non sunt,
          modi corrupti debitis sequi tenetur ab aut? Ea fugiat sunt aut eos
          veritatis quis explicabo corporis dolorum autem soluta quibusdam
          laborum aperiam, modi tempore nihil quaerat exercitationem dicta?
          Facilis tempore ex placeat est error soluta beatae odio natus ipsum
          optio, sapiente accusantium deleniti saepe aperiam sequi delectus in
          ullam? Quis voluptatibus sed aperiam quas atque at ipsam corporis,
          perferendis provident animi molestias voluptate suscipit commodi esse
          veniam tenetur pariatur totam eaque dicta dignissimos! Est neque
          doloremque quidem ipsum unde dolorem dicta nihil aspernatur laborum,
          illo placeat ex voluptatibus magnam?
        </div>
      </motion.section>
    </motion.div>
  );
};
export default Home;
