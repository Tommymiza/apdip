import { getFirestore, collection, getDocs,updateDoc, doc } from "firebase/firestore";
import app from "./db";
export class about {
  static getPostInstance() {
    const o = new about();
    return o ? o : new about();
  }
  async getdocument(setList) {
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.data());
    setList(resultat[0])
  }
  async getCommune(setCommune){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.data());
    console.log(resultat[0].commune)
    setCommune(resultat[0].commune)
  }
  async getTabCommune(setCoord){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.data());
    const c = {}
    const a = {}
    for (let i in resultat[0].commune){
      c[i] = resultat[0].commune[i].groupement
      a[i] = {top: resultat[0].commune[i].top, right:  resultat[0].commune[i].right}
    }
    setCoord(a)
    return c
  }
  async updateInfo(obj){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.id);
    await updateDoc(doc(getFirestore(app), "apropos", resultat[0]),obj)
  }
}
