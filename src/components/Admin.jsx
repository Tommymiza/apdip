import React, { useState, useEffect } from "react";
import app from "../firebase/db";
import { activity } from "../firebase/activite";
import {
  onSnapshot,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Button,
  TextField,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import {
  LibraryAddRounded,
  BorderColorRounded,
  DeleteRounded,
  PersonAddRounded,
  LogoutRounded,
  LockOpenRounded,
  AddAPhotoRounded,
  Close,
  SendRounded,
  ViewListRounded,
  EditRounded,
} from "@mui/icons-material";
import { theme } from "./theme";
import "../style/Admin.scss";
import { motion } from "framer-motion";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [passError, setPassError] = useState("");
  const [connected, setConnected] = useState(false);
  const [dialog, setDialog] = useState("");
  const [progress, setProgress] = useState(false);
  const [activite, setActivite] = useState("");
  const [status, setStatus] = useState("");
  const [activities, setActivities] = useState([]);
  const [pret, setPret] = useState(false);
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [drawer, toggleDrawer] = useState(false);
  const act = activity.getPostInstance();

  const updateAct = (e) => {
    e.preventDefault();
    setProgress(true);
    const newDate = new Date(document.getElementById("updateForm").date.value);
    const month =
      newDate.getMonth() + 1 < 10
        ? "0" + (newDate.getMonth() + 1)
        : newDate.getMonth() + 1;
    const day =
      newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    const exactDate = day + "-" + month + "-" + newDate.getFullYear();
    const obj = {
      date: exactDate,
      description: document.getElementById("updateForm").descri.value,
      filière: activite,
      place: document.getElementById("updateForm").lieu.value,
      title: document.getElementById("updateForm").titre.value,
    };
    act
      .updateActivity(obj, document.getElementById("updateForm").id.value)
      .then(() => {
        setProgress(false);
        setStatus("Activité mis à jour");
      });
  };
  const showimage = () => {
    var bool = true;
    var i = 0;
    while (bool) {
      if (document.getElementById("image" + i)) {
        document
          .getElementById("listes")
          .removeChild(document.getElementById("image" + i));
      } else {
        bool = false;
      }
      i++;
    }
    const fichiers = document.getElementById("dialogform").images.files;
    const arrayFile = Object.keys(fichiers);
    arrayFile.forEach((i) => {
      var node = document.createElement("img");
      node.setAttribute("id", `image${i}`);
      document.getElementById("listes").appendChild(node);
    });
    arrayFile.forEach((key) => {
      var reader = new FileReader();
      reader.onload = () => {
        document.getElementById("image" + key).src = reader.result;
      };
      reader.readAsDataURL(fichiers[key]);
    });
  };
  const handleChangeActivite = (event) => {
    setActivite(event.target.value);
  };
  const upload = async (e) => {
    e.preventDefault();
    await act.ajout(
      document.getElementById("dialogform"),
      document.getElementById("dialogform").images.files,
      setProgress,
      setStatus,
      setActivite
    );
  };
  const deluser = () => {
    setDialog("");
    document.cookie = "accessKey=; expires=01 Oct 1970 00:00:00 GMT";
    setConnected(false);
  };
  const handleSubmit = (e) => {
    const database = getFirestore(app);
    setPassError("");
    setLoading(true);
    e.preventDefault();
    const admins = collection(database, "admins");
    const q = query(
      admins,
      where("username", "==", document.getElementById("connexion").user.value)
    );
    onSnapshot(q, (snap) => {
      var id = snap.docs.map((doc) => doc.id);
      var list = snap.docs.map((doc) => doc.data());
      if (list.length === 0) {
        setPassError("Nom invalide!");
        setLoading(false);
      } else {
        if (
          document.getElementById("connexion").pass.value !== list[0].password
        ) {
          setPassError("Mot de passe invalid");
          setLoading(false);
        } else {
          document.cookie =
            "accessKey=" + id + ";expires=Sat, 31 Dec 2022 00:00:01 GMT";
          setLoading(false);
          setConnected(true);
        }
      }
    });
  };
  const handleClose = () => {
    setDialog("");
    setActivite("");
    setStatus("");
    setProgress(false);
  };
  function select(a) {
    document.getElementById("updateForm").id.value = a.id;
    document.getElementById("updateForm").titre.value = a.title;
    setActivite(a.filière);
    document.getElementById("updateForm").descri.value = a.description;
    document.getElementById("updateForm").lieu.value = a.place;
    var dateString = a.date.split("-");
    document.getElementById("updateForm").date.value =
      dateString[2] + "-" + dateString[1] + "-" + dateString[0];
  }
  useEffect(() => {
    return () => {
      setConnected(false);
      const tempdata = getFirestore(app);
      setCheck(true);
      const key = document.cookie;
      const keyitems = key.split(";");
      const keyitem = keyitems[0].split("=");
      const admins = collection(tempdata, "admins");
      getDocs(admins)
        .then((res) => {
          res.docs.forEach((doc) => {
            if (keyitem[1] === doc.id) {
              setConnected(true);
            }
          });
          setCheck(false);
        })
        .catch((err) => {
          alert(err);
          setCheck(false);
        });
      const act = activity.getPostInstance();
      act.list(setActivities).then(() => {
        setPret(true);
      });
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
        toggleDrawer(false);
      });
    };
  }, []);

  return check ? (
    <div id="adminsec">
      <CircularProgress size={100} sx={{ color: "#eca588" }}></CircularProgress>
    </div>
  ) : (
    <motion.div
      id="adminsec"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {connected ? (
        <div className="btngrid">
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "2px 2px 15px #6091A5",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setDialog("ajout")}
          >
            <Tooltip title="Ajout Activité">
              <LibraryAddRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "2px 2px 15px #6091A5",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => {
              setDialog("modifier");
            }}
          >
            <Tooltip title="Modification Activité">
              <BorderColorRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "2px 2px 15px #6091A5",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setDialog("suppression")}
          >
            <Tooltip title="Suppression Activité">
              <DeleteRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "2px 2px 15px #6091A5",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setDialog("ajoutAdmin")}
          >
            <Tooltip title="Ajout Admin">
              <PersonAddRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "2px 2px 15px #6091A5",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={deluser}
          >
            <Tooltip title="Log out">
              <LogoutRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Dialog open={dialog === "ajout"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "Gumela",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Ajout d'une activité:
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <form id="dialogform" onSubmit={upload}>
                <div>
                  <div className="form-row">
                    <TextField
                      label="Titre"
                      name="titre"
                      variant="standard"
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
                    <TextField
                      label="Filière"
                      name="select"
                      value={activite}
                      onChange={handleChangeActivite}
                      select
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    >
                      <MenuItem value={"Vary"}>Vary</MenuItem>
                      <MenuItem value={"Tsaramaso"}>Tsaramaso</MenuItem>
                      <MenuItem value={"Katsaka"}>Katsaka</MenuItem>
                      <MenuItem value={"Kisoa"}>Kisoa</MenuItem>
                      <MenuItem value={"Trondro"}>Trondro</MenuItem>
                      <MenuItem value={"Akoho Gasy"}>Akoho Gasy</MenuItem>
                    </TextField>
                    <TextField
                      label="Description"
                      name="descri"
                      variant="outlined"
                      multiline
                      maxRows={5}
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
                    <TextField
                      label="Lieu"
                      name="lieu"
                      variant="standard"
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
                    <input type="date" name="date" required />
                  </div>
                  <div className="form-row">
                    <Tooltip
                      title={"Joindre des photos"}
                      sx={{ alignSelf: "center" }}
                    >
                      <IconButton size="medium">
                        <label
                          htmlFor="img"
                          style={{ width: "30px", height: "30px" }}
                        >
                          <AddAPhotoRounded />
                        </label>
                      </IconButton>
                    </Tooltip>
                    <input
                      type="file"
                      name="images"
                      multiple
                      id="img"
                      accept="image/*"
                      required
                      onChange={showimage}
                    />
                    <div id="listes"></div>
                  </div>
                </div>
                {progress && <CircularProgress></CircularProgress>}
                <p>{status}</p>
                <ThemeProvider theme={theme}>
                  <Button type="submit" endIcon={<SendRounded />}>
                    Upload
                  </Button>
                </ThemeProvider>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={dialog === "modifier"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "Gumela",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Modification d'une activité:
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div id="updatediv">
                <form id="updateForm" onSubmit={updateAct}>
                  <input type="text" name="id" style={{ display: "none" }} />
                  <TextField
                    name="titre"
                    variant="standard"
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  <TextField
                    name="select"
                    value={activite}
                    onChange={handleChangeActivite}
                    select
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  >
                    <MenuItem value={"Vary"}>Vary</MenuItem>
                    <MenuItem value={"Tsaramaso"}>Tsaramaso</MenuItem>
                    <MenuItem value={"Katsaka"}>Katsaka</MenuItem>
                    <MenuItem value={"Kisoa"}>Kisoa</MenuItem>
                    <MenuItem value={"Trondro"}>Trondro</MenuItem>
                    <MenuItem value={"Akoho Gasy"}>Akoho Gasy</MenuItem>
                  </TextField>
                  <TextField
                    name="descri"
                    variant="outlined"
                    multiline
                    maxRows={5}
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  <TextField
                    name="lieu"
                    variant="standard"
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  <input type="date" name="date" required />
                  {progress && <CircularProgress></CircularProgress>}
                  <p>{status}</p>
                  <ThemeProvider theme={theme}>
                    <Button type="submit" endIcon={<EditRounded />}>
                      Valider
                    </Button>
                  </ThemeProvider>
                </form>
                {pret ? (
                  <ul className={drawer ? "shown" : ""}>
                    {activities.map((item) => (
                      <li key={item.id}>
                        <ThemeProvider theme={theme}>
                          <Button onClick={() => select(item)}>
                            {item.title} {item.date}
                          </Button>
                        </ThemeProvider>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul><li><CircularProgress size={50}></CircularProgress></li></ul>
                )}
              </div>
            </DialogContent>
            {width < 850 && (
              <IconButton
                className="showList"
                onClick={() => {
                  toggleDrawer(!drawer);
                }}
              >
                {drawer ? <Close /> : <ViewListRounded />}
              </IconButton>
            )}
          </Dialog>
        </div>
      ) : (
        <form id="connexion" onSubmit={handleSubmit}>
          <TextField label="Username" name="user"></TextField>
          <TextField label="Password" name="pass" type={"password"}></TextField>
          <p>{passError}</p>
          {loading ? (
            <CircularProgress size={24}></CircularProgress>
          ) : (
            <Button
              type="submit"
              startIcon={<LockOpenRounded />}
              sx={{
                color: "white",
                p: 1,
                border: "none",
                boxShadow: "2px 2px 10px #6091A5",
                borderRadius: "7px",
              }}
            >
              Login
            </Button>
          )}
        </form>
      )}
    </motion.div>
  );
};

export default Admin;
