import { getFirestore, collection, getDocs,updateDoc, doc, query, orderBy, addDoc, deleteDoc } from "firebase/firestore";
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
  async getMessage(){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "message")
    const q = query(aboutDoc, orderBy("status", "asc"))
    const res =  await getDocs(q)
    const resultat = res.docs.map(doc=>{return {id: doc.id, content: doc.data()}});
    return resultat
  }
  async updateMessage(id, obj){
    await updateDoc(doc(getFirestore(app), "message", id),obj)
  }
  async deleteMessage(tab){
    for(let id of tab){
      await deleteDoc(doc(getFirestore(app), "message", id))
    }
  }
  async addMessage(obj){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "message");
    await addDoc(aboutDoc, obj)
  }
  async updateInfo(obj){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.id);
    await updateDoc(doc(getFirestore(app), "apropos", resultat[0]),obj)
  }
}
