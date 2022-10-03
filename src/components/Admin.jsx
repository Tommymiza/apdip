import React, { useState, useEffect } from "react";
import app from "./db";
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
  DialogActions,
  DialogContent,
} from "@mui/material";
import {
  LibraryAddRounded,
  BorderColorRounded,
  DeleteRounded,
  PersonAddRounded,
  LogoutRounded,
  LockOpenRounded,
} from "@mui/icons-material";
import "../style/Admin.scss";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [passError, setPassError] = useState("");
  const [connected, setConnected] = useState(false);
  const [dialog, setDialog] = useState("");

  const showimage = () => {
    const fichiers = document.getElementById("dialogform").images.files;
    var bool = true
    var i = 0
    while(bool){
      if(document.getElementById("image"+i)){
        document.getElementById("listes").removeChild(document.getElementById("image"+i))
      }else{
        bool = false
      }
      i++
    }
    const arrayFile = Object.keys(fichiers);
    arrayFile.forEach((i) => {
      var node = document.createElement('img')
      node.setAttribute('id', `image${i}`)
      document.getElementById("listes").appendChild(node);
    });
    setTimeout(() => {
      arrayFile.forEach((key) => {
        var reader = new FileReader();
        reader.onload = () => {
          document.getElementById("image" + key).src = reader.result;
        };
        reader.readAsDataURL(fichiers[key]);
      });
    }, 500);
  };

  const upload =  (e)=>{
    e.preventDefault()

  }
  const deluser = () => {
    setDialog("");
    document.cookie = "accessKey=; expires=01 Oct 1970 00:00:00 GMT";
    setConnected(false);
  };

  const database = getFirestore(app);

  const handleSubmit = (e) => {
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
  };

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
    };
  }, []);

  return check ? (
    <div id="adminsec">
      <CircularProgress size={100} sx={{ color: "#eca588" }}></CircularProgress>
    </div>
  ) : (
    <div id="adminsec">
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
            onClick={() => setDialog("modification")}
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
          <Dialog open={dialog === "ajout"} onClose={handleClose}>
            <DialogTitle sx={{fontFamily: 'Gumela', fontSize: 30, alignSelf: 'center'}}>Ajout d'une activité:</DialogTitle>
            <DialogContent>
              <form id="dialogform" onSubmit={upload}>
                <TextField
                  label="Titre"
                  name="titre"
                  variant="standard"
                  required
                  sx={{width: 300,fontFamily: 'var(--fontText)'}}
                ></TextField>
                <TextField
                  label="Description"
                  name="descri"
                  variant="outlined"
                  multiline
                  maxRows={5}
                  required
                  sx={{width: 300,fontFamily: 'var(--fontText)'}}
                ></TextField>
                <input type="date" name="date" required />
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  required
                  onChange={showimage}
                />
                <div id="listes"></div>
                <DialogActions>
                  <Button type="submit">Upload</Button>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </form>
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
    </div>
  );
};

export default Admin;
