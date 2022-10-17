import React, { useState, useContext } from "react";
import { ActContext } from "../App";
import "../style/List.scss";
import Activite from "./Activite";
import Carte from "./Carte";
import {
  Card,
  Skeleton,
  CardContent,
  CardActions,
  Button,
  Typography,
  ThemeProvider,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  VisibilityRounded,
  VisibilityOffRounded,
  FilterAltRounded,
  FilterAltOffRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { theme } from "./theme";
const List = () => {
  const skeleton = [0, 1, 2, 3, 4, 5];
  const [map, setMap] = useState(false);
  const [some, setSome] = useState([]);
  const [option, setOption] = useState("");

  const { activities, pret } = useContext(ActContext);
  const resetFilter = () => {
    setOption("");
    document.getElementById("datedebut").value = "";
    document.getElementById("datefin").value = "";
    document.getElementById("rech").value = "";
    setSome([]);
  };
  function filtre(opt, dateDeb, dateFin, search) {
    var tab = [];
    if (search !== "") {
      // eslint-disable-next-line
      tab = activities.filter((obj) => {
        if (obj.title.includes(search) || obj.description.includes(search)) {
          return obj;
        }
      });
    }
    if (tab.length !== 0) {
      if (opt !== "" && dateDeb !== "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (
            obj.filière === opt &&
            obj.date >= dateDeb &&
            obj.date <= dateFin
          ) {
            return obj;
          }
        });
      } else if (opt !== "" && dateDeb !== "" && dateFin === "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (obj.filière === opt && obj.date >= dateDeb) {
            return obj;
          }
        });
      } else if (opt !== "" && dateDeb === "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (obj.filière === opt && obj.date <= dateFin) {
            return obj;
          }
        });
      } else if (opt !== "" && dateDeb === "" && dateFin === "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (obj.filière === opt) {
            return obj;
          }
        });
      } else if (opt === "" && dateDeb !== "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (obj.date >= dateDeb && obj.date <= dateFin) {
            return obj;
          }
        });
      } else if (opt === "" && dateDeb === "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (obj.date <= dateFin) {
            return obj;
          }
        });
      } else if (opt === "" && dateDeb !== "" && dateFin === "") {
        // eslint-disable-next-line
        tab = tab.filter((obj) => {
          if (obj.date >= dateDeb) {
            return obj;
          }
        });
      } else {
        tab = tab.filter((obj) => {
          return obj;
        });
      }
    } else {
      if (opt !== "" && dateDeb !== "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (
            obj.filière === opt &&
            obj.date >= dateDeb &&
            obj.date <= dateFin
          ) {
            return obj;
          }
        });
      } else if (opt !== "" && dateDeb !== "" && dateFin === "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (obj.filière === opt && obj.date >= dateDeb) {
            return obj;
          }
        });
      } else if (opt !== "" && dateDeb === "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (obj.filière === opt && obj.date <= dateFin) {
            return obj;
          }
        });
      } else if (opt !== "" && dateDeb === "" && dateFin === "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (obj.filière === opt) {
            return obj;
          }
        });
      } else if (opt === "" && dateDeb !== "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (obj.date >= dateDeb && obj.date <= dateFin) {
            return obj;
          }
        });
      } else if (opt === "" && dateDeb === "" && dateFin !== "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (obj.date <= dateFin) {
            return obj;
          }
        });
      } else if (opt === "" && dateDeb !== "" && dateFin === "") {
        // eslint-disable-next-line
        tab = activities.filter((obj) => {
          if (obj.date >= dateDeb) {
            return obj;
          }
        });
      } else {
        tab = tab.filter((obj) => {
          return obj;
        });
      }
    }

    if (tab.length !== 0) {
      setSome(tab);
    } else {
      alert("Pas d'activité de ce genre!");
    }
  }
  return (
    <motion.div id="list" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <motion.div
        id="filtre"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 1,
        }}
      >
        <div id="formFilter">
          <div>
            <label htmlFor="option">Filière: &nbsp;</label>
            <TextField
              id="option"
              name="select"
              value={option}
              onChange={(e) => {
                setOption(e.target.value);
              }}
              defaultValue=""
              select
              sx={{ fontFamily: "var(--fontText)" }}
            >
              <MenuItem value={""}>--none--</MenuItem>
              <MenuItem value={"Vary"}>Vary</MenuItem>
              <MenuItem value={"Tsaramaso"}>Tsaramaso</MenuItem>
              <MenuItem value={"Katsaka"}>Katsaka</MenuItem>
              <MenuItem value={"Kisoa"}>Kisoa</MenuItem>
              <MenuItem value={"Trondro"}>Trondro</MenuItem>
              <MenuItem value={"Akoho Gasy"}>Akoho Gasy</MenuItem>
            </TextField>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label htmlFor="datedebut">Le: &nbsp;</label>
            <TextField
              id="datedebut"
              type={"date"}
              sx={{ fontFamily: "var(--fontText)" }}
            ></TextField>
            <label htmlFor="datefin">&nbsp;Jusqu'à: &nbsp;</label>
            <TextField
              id="datefin"
              type={"date"}
              sx={{ fontFamily: "var(--fontText)" }}
            ></TextField>
          </div>
          <div>
            <TextField
              type={"search"}
              label="--Recherche--"
              id="rech"
            ></TextField>
          </div>
        </div>
        <div>
          <Button
            startIcon={<FilterAltRounded />}
            onClick={() =>
              filtre(
                option,
                document.getElementById("datedebut").value.toString(),
                document.getElementById("datefin").value.toString(),
                document.getElementById("rech").value
              )
            }
          >
            Filtrer
          </Button>
          <Button startIcon={<FilterAltOffRounded />} onClick={resetFilter}>
            Reset
          </Button>
        </div>
      </motion.div>
      {some.length === 0 ? (
        pret ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "80%",
              justifyContent: "space-evenly",
              gap: 10,
            }}
          >
            {activities &&
              activities.map((activity) => (
                <Activite key={activity.id} activ={activity} accueil={false} />
              ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "80%",
              justifyContent: "space-evenly",
              gap: 10,
            }}
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
          </div>
        )
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "80%",
            justifyContent: "space-evenly",
            gap: 10,
          }}
        >
          {some &&
            some.map((activity) => (
              <Activite key={activity.id} activ={activity} accueil={false} />
            ))}
        </div>
      )}
      <ThemeProvider theme={theme}>
        <Button
          onClick={() => {
            setMap(!map);
          }}
          sx={{ mt: 3 }}
          startIcon={map ? <VisibilityOffRounded /> : <VisibilityRounded />}
        >
          {map ? "Cacher la carte" : "Afficher la Carte"}
        </Button>
      </ThemeProvider>
      {map && (
        <div className="map">
          <Carte />
        </div>
      )}
    </motion.div>
  );
};

export default List;
