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
  Box,
  Badge,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
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
  AddShoppingCartRounded,
} from "@mui/icons-material";
import "../style/Admin.scss";
import { motion } from "framer-motion";
import { ActContext } from "../App";
import Btn from "./outils/btn";

const Admin = () => {
  const {
    activities,
    pret,
    list,
    aboutloading,
    setActivities,
    setList,
    setProduits,
  } = useContext(ActContext);
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
        field: "fili??re",
        headerName: "Fili??re",
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
      alert("Sel??ctionnez une activit??");
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
        fili??re: activite,
        place: document.getElementById("updateForm").lieu.value,
        title: document.getElementById("updateForm").titre.value,
      };
      act
        .updateActivity(obj, document.getElementById("updateForm").id.value)
        .then(() => {
          act.list(setActivities).then(() => {
            setProgress(false);
            setStatus("Activit?? mis ?? jour");
          });
        });
    } else {
      setStatus("Vous devez s??l??ctionner une activit?? ?? modifier");
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
    var fichiers = "";
    if (dialog === "ajout") {
      fichiers = document.getElementById("dialogform").images.files;
    } else {
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
    setActivite(a.fili??re);
    document.getElementById("updateForm").descri.value = a.description;
    document.getElementById("updateForm").lieu.value = a.place;
    var dateString = a.date.split("-");
    document.getElementById("updateForm").date.value =
      dateString[0] + "-" + dateString[1] + "-" + dateString[2];
    toggleDrawer(false);
  }
  useEffect(() => {
    const abot = about.getPostInstance();
    document.title = "Dashboard | Apdip";
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
  }, []);

  return check ? (
    <div id="adminsec">
      <CircularProgress size={100} sx={{ color: "#eca588" }}></CircularProgress>
    </div>
  ) : (
    <motion.div
      id="adminsec"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
    >
      {connected ? (
        <div className="btngrid">
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "0 0 15px rgb(88, 82, 82)",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setDialog("ajout")}
          >
            <Tooltip title="Ajout Activit??">
              <LibraryAddRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "0 0 15px rgb(88, 82, 82)",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => {
              setDialog("modifier");
            }}
          >
            <Tooltip title="Modification Activit??">
              <BorderColorRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "0 0 15px rgb(88, 82, 82)",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setDialog("supprimer")}
          >
            <Tooltip title="Suppression Activit??">
              <DeleteRounded sx={{ width: 50, height: 50 }} />
            </Tooltip>
          </Button>
          <Button
            sx={{
              border: "none",
              p: 5,
              background: "rgba(0,0,0,0.05)",
              boxShadow: "0 0 15px rgb(88, 82, 82)",
              borderRadius: "20px",
              backdropFilter: "blur(2px)",
            }}
            onClick={tempCom}
          >
            <Tooltip title="Param??tre">
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
              boxShadow: "0 0 15px rgb(88, 82, 82)",
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
              boxShadow: "0 0 15px rgb(88, 82, 82)",
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
                fontFamily: "var(--fontText)",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Ajout d'une activit??:
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
                      label="Fili??re"
                      name="select"
                      value={activite}
                      onChange={handleChangeActivite}
                      select
                      required
                      sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                    >
                      {list &&
                        list.Fili??re.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
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
                <p>{status}</p>
                <LoadingButton
                  type="submit"
                  loading={progress}
                  loadingIndicator={
                    <CircularProgress color="primary" size={16} />
                  }
                  endIcon={<SendRounded />}
                >
                  Upload
                </LoadingButton>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={dialog === "ajoutproduit"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "var(--fontText)",
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
                      label="Fili??re"
                      name="fili??re"
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
                <p>{status}</p>
                <LoadingButton
                  type="submit"
                  loading={progress}
                  loadingIndicator={
                    <CircularProgress color="primary" size={16} />
                  }
                  endIcon={<SendRounded />}
                >
                  Upload
                </LoadingButton>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog
            open={dialog === "modifier"}
            sx={{ overflowX: "hidden", width: "100vw" }}
            fullScreen
          >
            <DialogTitle
              sx={{
                fontFamily: "var(--fontText)",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Modification d'une activit??:
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ overflowX: "hidden" }}>
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
                  <label>Fili??re:</label>
                  <TextField
                    name="select"
                    value={activite}
                    onChange={handleChangeActivite}
                    select
                    required
                    sx={{ width: "100%", fontFamily: "var(--fontText)" }}
                  >
                    {list &&
                      list.Fili??re.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
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
                  <p>{status}</p>
                  <LoadingButton
                    loading={progress}
                    loadingIndicator={
                      <CircularProgress color="primary" size={16} />
                    }
                    type="submit"
                    endIcon={<EditRounded />}
                  >
                    Valider
                  </LoadingButton>
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
                </form>
                {pret ? (
                  <ul className={drawer ? "shown" : ""}>
                    <li
                      style={{
                        fontFamily: "var(--fontText)",
                        fontSize: "25px",
                      }}
                    >
                      Listes des activit??s:
                    </li>
                    {activities ? (
                      activities.map((item) => (
                        <li key={item.id}>
                          <Button onClick={() => select(item)}>
                            {item.title} {item.date}
                          </Button>
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
                fontFamily: "var(--fontText)",
                fontSize: 30,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              Supprimer des activit??s:
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
                  <Box sx={{ height: 400, width: "100%", marginBottom: 2 }}>
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
                <LoadingButton
                  type="submit"
                  endIcon={<DeleteRounded />}
                  onClick={handleDelete}
                  loading={progress}
                  loadingIndicator={
                    <CircularProgress color="primary" size={16} />
                  }
                >
                  Supprimer
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialog === "settings"} fullScreen>
            <DialogTitle
              sx={{
                fontFamily: "var(--fontText)",
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
                          Info de base:
                        </h4>
                        <TextField
                          label="Assembl??e gen??rale:"
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
                          Communes et groupements:
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
                        <LoadingButton
                          startIcon={<DeleteRounded />}
                          onClick={delmessage}
                          loading={progress1}
                          loadingIndicator={
                            <CircularProgress color="primary" size={16} />
                          }
                        >
                          Vider
                        </LoadingButton>
                      </div>
                    </div>
                    <LoadingButton
                      loading={progress}
                      loadingIndicator={
                        <CircularProgress color="primary" size={16} />
                      }
                      startIcon={<EditRounded />}
                      type="submit"
                    >
                      Modifier
                    </LoadingButton>
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
            <Btn text="Login" icon={<LockOpenRounded />} />
          )}
        </form>
      )}
    </motion.div>
  );
};

export default Admin;
