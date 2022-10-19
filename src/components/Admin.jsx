import React, { useState, useEffect, useContext, useMemo } from "react";
import app from "../firebase/db";
import { activity } from "../firebase/activite";
import { about } from "../firebase/about";
import { produit } from "../firebase/produit";
import { DataGrid } from "@mui/x-data-grid";
import View from "./view";
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
  Box,
  Badge,
} from "@mui/material";
import {
  LibraryAddRounded,
  BorderColorRounded,
  DeleteRounded,
  Settings,
  LogoutRounded,
  LockOpenRounded,
  AddAPhotoRounded,
  Close,
  SendRounded,
  ViewListRounded,
  EditRounded,
  AddCircleOutlineRounded,
  RemoveCircleOutlineRounded,
  AddShoppingCartRounded
} from "@mui/icons-material";
import { theme } from "./theme";
import "../style/Admin.scss";
import { motion } from "framer-motion";
import { ActContext } from "../App";

const Admin = () => {
  const { activities, pret, list, aboutloading, setActivities, setList, setProduits } =
    useContext(ActContext);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [passError, setPassError] = useState("");
  const [connected, setConnected] = useState(false);
  const [dialog, setDialog] = useState("");
  const [progress, setProgress] = useState(false);
  const [progress1, setProgress1] = useState(false);
  const [activite, setActivite] = useState("");
  const [status, setStatus] = useState("");
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [drawer, toggleDrawer] = useState(false);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState([]);
  const [showMessage, setShowMessage] = useState();
  const [com, setCom] = useState({});
  const [coord, setCoord] = useState({});
  const [keys, setKeysCom] = useState([]);
  const [badge, setBadge] = useState(0);
  const act = activity.getPostInstance();
  const abt = about.getPostInstance();
  const prod = produit.getPostInstance();
  const show = (i) => {
    var temp = message;
    temp = temp.filter((a) => {
      if (a.id === i.id) {
        a.content.status = true;
      }
      return a;
    });
    var n = 0;
    for (let i of temp) {
      if (!i.content.status) {
        n = n + 1;
      }
    }
    setBadge(n);
    const obj = temp.find((element) => element.id === i.id);
    abt.updateMessage(i.id, obj.content);
    setMessage(temp);
    setShowMessage(<View item={i} close={hideMessage} />);
  };
  const delmessage = () => {
    setProgress1(true);
    const temp = [];
    for (let i of message) {
      if (i.content.status) {
        temp.push(i.id);
      }
    }
    abt.deleteMessage(temp).then(() => {
      abt.getMessage().then((res) => {
        setMessage(res);
        setProgress1(false);
      });
    });
  };
  const hideMessage = () => {
    setShowMessage();
  };
  const columns = useMemo(() => {
    return [
      {
        field: "title",
        headerName: "Titre",
        width: width / 4 - 25,
      },
      {
        field: "date",
        headerName: "Date",
        width: width / 4 - 25,
      },
      {
        field: "filière",
        headerName: "Filière",
        width: width / 4 - 25,
      },
      {
        field: "place",
        headerName: "Place",
        width: width / 4 - 25,
      },
    ];
  }, [width]);
  const infoupdate = (e) => {
    e.preventDefault();
    setProgress(true);
    var c = {};
    for (let i of keys) {
      c[i] = { groupement: com[i], top: coord[i].top, right: coord[i].right };
    }
    console.log(c);
    const obj = {
      ag: document.getElementById("infoform").ag.value,
      paysans: document.getElementById("infoform").paysans.value,
      paysRel: document.getElementById("infoform").paysRel.value,
      paysVulga: document.getElementById("infoform").paysVulga.value,
      technicien: document.getElementById("infoform").technicien.value,
      commune: c,
    };
    abt.updateInfo(obj).then(() => {
      abt.getdocument(setList).then(() => {
        setProgress(false);
      });
    });
  };
  const handleDelete = () => {
    if (selected.length > 0) {
      var promises = [];
      setProgress(true);
      for (let item of activities) {
        if (selected.indexOf(item.id) > -1) {
          promises.push(act.delete(item.id, item.path, item.files));
        }
      }
      Promise.all(promises).then(() => {
        act.list(setActivities).then(() => {
          setProgress(false);
        });
      });
    } else {
      alert("Seléctionnez une activité");
    }
  };
  const updateAct = (e) => {
    e.preventDefault();
    if (document.getElementById("updateForm").id.value !== "") {
      setProgress(true);
      setStatus("");
      const newDate = new Date(
        document.getElementById("updateForm").date.value
      );
      const month =
        newDate.getMonth() + 1 < 10
          ? "0" + (newDate.getMonth() + 1)
          : newDate.getMonth() + 1;
      const day =
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
      const exactDate = newDate.getFullYear() + "-" + month + "-" + day;
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
          act.list(setActivities).then(() => {
            setProgress(false);
            setStatus("Activité mis à jour");
          });
        });
    } else {
      setStatus("Vous devez séléctionner une activité à modifier");
    }
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
    var fichiers = ""
    if(dialog === "ajout"){
      fichiers = document.getElementById("dialogform").images.files;
    }else{
      fichiers = document.getElementById("dialogform").photo.files;
    }
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
  const addGrp = (a) => {
    var temp = Object.create(com);
    temp[a] = [...temp[a], ""];
    setCom(temp);
  };
  const handleChangeActivite = (event) => {
    setActivite(event.target.value);
  };
  const uploadProduit = (e) => {
    e.preventDefault();
    prod.ajout(
      document.getElementById("dialogform"),
      document.getElementById("dialogform").photo.files,
      setProduits,
      setStatus,
      setProgress
    );
  };
  const upload = (e) => {
    e.preventDefault();

    act.ajout(
      document.getElementById("dialogform"),
      document.getElementById("dialogform").images.files,
      setActivite,
      setStatus,
      setProgress,
      setActivities
    );
  };
  const deluser = () => {
    setDialog("");
    document.cookie = "accessKey=; expires=01 Oct 1970 00:00:00 GMT";
    setConnected(false);
  };
  const tempCom = () => {
    abt.getTabCommune(setCoord).then((res) => {
      const keys = Object.keys(res);
      setCom(res);
      setKeysCom(keys);
    });
    abt.getMessage().then((res) => {
      setMessage(res);
      var n = 0;
      for (let i of res) {
        if (!i.content.status) {
          n = n + 1;
        }
      }
      setBadge(n);
    });
    setDialog("settings");
  };
  const delgrp = (c, index) => {
    var temp = Object.create(com);
    temp[c].splice(index, 1);
    setCom(temp);
  };
  const updgrp = (v, c, i) => {
    var temp = Object.create(com);
    temp[c][i] = v;
    setCom(temp);
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
      dateString[0] + "-" + dateString[1] + "-" + dateString[2];
    toggleDrawer(false);
  }
  useEffect(() => {
    const abot = about.getPostInstance();
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
      window.addEventListener("resize", () => {
        setWidth(document.body.offsetWidth);
        toggleDrawer(false);
      });
      abot.getTabCommune(setCoord).then((res) => {
        const keys = Object.keys(res);
        setCom(res);
        setKeysCom(keys);
      });
      abot.getMessage().then((res) => {
        setMessage(res);
        var n = 0;
        for (let i of res) {
          if (!i.content.status) {
            n = n + 1;
          }
        }
        setBadge(n);
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
            onClick={() => setDialog("supprimer")}
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
            onClick={tempCom}
          >
            <Tooltip title="Paramètre">
              <Badge badgeContent={badge} color={"error"} max={9}>
                <Settings sx={{ width: 50, height: 50 }} />
              </Badge>
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
            onClick={() => setDialog("ajoutproduit")}
          >
            <Tooltip title="Ajout Produit">
              <AddShoppingCartRounded sx={{ width: 50, height: 50 }} />
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
                fontFamily: "SF Pro",
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
                    <TextField
                      name="date"
                      variant="standard"
                      type="date"
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
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
          <Dialog open={dialog === "ajoutproduit"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "SF Pro",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Ajout d'un produit:
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <form id="dialogform" onSubmit={uploadProduit}>
                <div>
                  <div className="form-row">
                    <TextField
                      label="Filière"
                      name="filière"
                      variant="standard"
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
                    <TextField
                      label="Stock"
                      name="stock"
                      variant="standard"
                      type={"number"}
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
                    <TextField
                    label="Unit"
                    name="unit"
                    variant="standard"
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                    <TextField
                      label="Prix"
                      name="prix"
                      variant="standard"
                      type={"number"}
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    ></TextField>
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
                      name="photo"
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
                fontFamily: "SF Pro",
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
                  <label>Titre:</label>
                  <input type="text" name="id" style={{ display: "none" }} />
                  <TextField
                    name="titre"
                    variant="standard"
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  <label>Filière:</label>
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
                  <label>Description:</label>
                  <TextField
                    name="descri"
                    variant="outlined"
                    multiline
                    maxRows={5}
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  <label>Place: </label>
                  <TextField
                    name="lieu"
                    variant="standard"
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  <label>Date:</label>
                  <TextField
                    name="date"
                    variant="standard"
                    type="date"
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  ></TextField>
                  {progress && (
                    <CircularProgress
                      size={35}
                      sx={{ mt: 3 }}
                    ></CircularProgress>
                  )}
                  <p>{status}</p>
                  <ThemeProvider theme={theme}>
                    <Button type="submit" endIcon={<EditRounded />}>
                      Valider
                    </Button>
                    {width < 850 && (
                      <Button
                        onClick={() => {
                          toggleDrawer(!drawer);
                        }}
                        sx={{ zIndex: 2 }}
                      >
                        {drawer ? <Close /> : <ViewListRounded />}
                      </Button>
                    )}
                  </ThemeProvider>
                </form>
                {pret ? (
                  <ul className={drawer ? "shown" : ""}>
                    <li
                      style={{
                        fontFamily: "var(--fontText)",
                        fontSize: "25px",
                      }}
                    >
                      Listes des activités:
                    </li>
                    {activities ? (
                      activities.map((item) => (
                        <li key={item.id}>
                          <ThemeProvider theme={theme}>
                            <Button onClick={() => select(item)}>
                              {item.title} {item.date}
                            </Button>
                          </ThemeProvider>
                        </li>
                      ))
                    ) : (
                      <li>
                        <CircularProgress size={50}></CircularProgress>
                      </li>
                    )}
                  </ul>
                ) : (
                  <ul>
                    <li>
                      <CircularProgress size={50}></CircularProgress>
                    </li>
                  </ul>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialog === "supprimer"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "SF Pro",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Supprimer des activités:
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div
                id="supdiv"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {activities ? (
                  <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={activities}
                      columns={columns}
                      checkboxSelection
                      disableSelectionOnClick
                      rowsPerPageOptions={[5]}
                      pageSize={5}
                      onSelectionModelChange={(newSelection) => {
                        setSelected(newSelection);
                      }}
                    />
                  </Box>
                ) : (
                  <CircularProgress size={50}></CircularProgress>
                )}
                {progress && <CircularProgress size={50}></CircularProgress>}
                <ThemeProvider theme={theme}>
                  <Button
                    type="submit"
                    endIcon={<DeleteRounded />}
                    onClick={handleDelete}
                  >
                    Supprimer
                  </Button>
                </ThemeProvider>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialog === "settings"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "SF Pro",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Gestion interne:
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {aboutloading ? (
                <div id="aboutupdate">
                  <form
                    style={{ minWidth: "400px" }}
                    onSubmit={infoupdate}
                    id="infoform"
                  >
                    <div id="modifinfo">
                      <div id="infoprop">
                        <h4 style={{ fontFamily: "var(--fontText)" }}>
                          Info de base
                        </h4>
                        <TextField
                          label="Assemblée genérale:"
                          type={"number"}
                          defaultValue={list.ag}
                          required
                          name="ag"
                        />
                        <TextField
                          label="Paysans:"
                          type={"number"}
                          defaultValue={list.paysans}
                          required
                          name="paysans"
                        />
                        <TextField
                          label="Paysans relais:"
                          type={"number"}
                          defaultValue={list.paysRel}
                          required
                          name="paysRel"
                        />
                        <TextField
                          label="Paysans vulgarisateur:"
                          type={"number"}
                          defaultValue={list.paysVulga}
                          required
                          name="paysVulga"
                        />
                        <TextField
                          label="Technicien:"
                          type={"number"}
                          defaultValue={list.technicien}
                          required
                          name="technicien"
                        />
                      </div>
                      <div id="setComs">
                        <h4
                          style={{
                            fontFamily: "var(--fontText)",
                            alignSelf: "flex-start",
                          }}
                        >
                          Communes et groupements
                        </h4>
                        <div className="listComm">
                          {keys.length !== 0 &&
                            keys.map((c) => (
                              <div className="communes" key={c}>
                                {com[c].length !== 0 && (
                                  <TextField
                                    disabled
                                    defaultValue={c}
                                    label="commune"
                                    required
                                  />
                                )}
                                {com[c].lenght !== 0 &&
                                  com[c].map((i, index) => (
                                    <div key={i} className="grp">
                                      <TextField
                                        id={"grp" + i}
                                        defaultValue={i}
                                        label="grp"
                                        onBlur={(e) => {
                                          updgrp(e.target.value, c, index);
                                        }}
                                        InputLabelProps={{
                                          style: {
                                            fontSize: "15px",
                                          },
                                        }}
                                        InputProps={{
                                          style: {
                                            height: "40px",
                                          },
                                        }}
                                        inputProps={{
                                          style: {
                                            fontSize: "15px",
                                          },
                                        }}
                                        required
                                      />
                                      <IconButton
                                        size="medium"
                                        onClick={() => {
                                          delgrp(c, index);
                                        }}
                                      >
                                        <RemoveCircleOutlineRounded />
                                      </IconButton>
                                    </div>
                                  ))}
                                <IconButton
                                  size="medium"
                                  sx={{
                                    marginLeft: "50px",
                                    alignSelf: "center",
                                  }}
                                  onClick={() => {
                                    addGrp(c);
                                  }}
                                >
                                  <AddCircleOutlineRounded />
                                </IconButton>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div id="viewmessage">
                        <h4
                          style={{
                            fontFamily: "var(--fontText)",
                            alignSelf: "flex-start",
                          }}
                        >
                          Messages:
                        </h4>
                        <div className="messagelist">
                          {message.length !== 0 &&
                            message.map((i) => (
                              <div
                                className={
                                  i.content.status ? "mess" : "mess nonvue"
                                }
                                key={i.id}
                                id={i.id}
                                onClick={() => show(i)}
                              >
                                <h4>{i.content.name}</h4>
                                <p>{i.content.message.substr(0, 30) + "..."}</p>
                              </div>
                            ))}
                          {showMessage}
                        </div>
                        <ThemeProvider theme={theme}>
                          {progress1 && <CircularProgress size={24} />}
                          <Button
                            startIcon={<DeleteRounded />}
                            onClick={delmessage}
                          >
                            Vider
                          </Button>
                        </ThemeProvider>
                      </div>
                    </div>
                    <ThemeProvider theme={theme}>
                      {progress && <CircularProgress size={24} />}
                      <Button startIcon={<EditRounded />} type="submit">
                        Modifier
                      </Button>
                    </ThemeProvider>
                  </form>
                </div>
              ) : (
                <CircularProgress size={50} />
              )}
            </DialogContent>
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
