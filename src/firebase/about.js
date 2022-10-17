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
    setCommune(resultat[0].commune)
  }
  async updateInfo(obj){
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.id);
    await updateDoc(doc(getFirestore(app), "apropos", resultat[0]),obj)
  }
}
