import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./db";
export class about {
  static getpostinstance() {
    const o = new about();
    return o ? o : new about();
  }
  async getdocument(setList,setNomCommune) {
    const database = getFirestore(app);
    const aboutDoc = collection(database, "apropos");
    const res = await getDocs(aboutDoc);
    const resultat = res.docs.map((doc) => doc.data());
    setList(resultat[0])
    setNomCommune(Object.keys(resultat[0].commune))
  }
}
