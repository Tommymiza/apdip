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
import { Button, Grid, TextField, CircularProgress } from "@mui/material";
import "../style/Admin.scss";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [connected, setConnected] = useState(false);

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
          setUsername(list[0].username);
          setPassword(list[0].password);
          document.cookie =
            "accessKey=" + id + ";expires=Sat, 31 Dec 2022 00:00:01 GMT";
          setLoading(false);
        }
      }
    });
  };
  useEffect(() => {
    return () => {
      setCheck(true);
      const key = document.cookie;
      const keyitems = key.split(";");
      const keyitem = keyitems[0].split("=");
      const admins = collection(database, "admins");
      getDocs(admins)
        .then((res) => {
          res.docs.map((doc) => {
            if (keyitem[1] === doc.id) {
              setUsername(doc.data().username);
              setPassword(doc.data().password);
            }
          });
          setCheck(false);
        })
        .catch((err) => {
          alert(err);
          setCheck(false);
        });
    };
  }, [connected]);

  return check ? (
    <div id="adminsec">
      <CircularProgress size={100}></CircularProgress>
    </div>
  ) : (
    <div id="adminsec">
      {username !== "" && password !== "" && (
        <Grid container direction={'row'}>
          <Grid item>
            <Button>Ajouter une activité</Button>
          </Grid>
          <Grid item>
            <Button>Modififier une activité</Button>
          </Grid>
          <Grid item>
            <Button>Supprimer une activité</Button>
          </Grid>
          <Grid item>
            <Button>Ajout d'un administrateur</Button>
          </Grid>
          <Grid item>
            <Button>Modifier les apropos</Button>
          </Grid>
          <Grid item>
            <Button>Modifier les Groupements de base</Button>
          </Grid>
        </Grid>
      )}
      {username === "" && password === "" && (
        <form id="connexion" onSubmit={handleSubmit}>
          <TextField label="Username" name="user"></TextField>
          <TextField label="Password" name="pass" type={"password"}></TextField>
          <p>{passError}</p>
          {loading ? (
            <CircularProgress size={24}></CircularProgress>
          ) : (
            <Button type="submit" variant="outlined">
              Valider
            </Button>
          )}
        </form>
      )}
    </div>
  );
};

export default Admin;
