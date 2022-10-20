import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  addDoc,
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query, 
  orderBy
} from "firebase/firestore";
import app from "./db";
export class produit {
  static getPostInstance() {
    const instance = new produit();
    return instance ? instance : new produit();
  }
  async querydoc(str) {
    const database = getFirestore(app);
    const produit = collection(database, str);
    const q = query(produit, orderBy("filière", "asc"));
    const document = await getDocs(q);
    var act = [];
    document.docs.forEach((item) => {
      act = [...act, { id: item.id, contenu: item.data() }];
    });
    return act;
  }
  async ajout(formDial, fichiers, setProduit, setStatus, setProgress) {
    setProgress(true);
    setStatus("");
    const arrayFile = Object.keys(fichiers);
    var pathArray = [];
    arrayFile.forEach((file) => {
      pathArray = [...pathArray, fichiers[file].name];
    });
    const produit = {
      unit: formDial.unit.value,
      photo: pathArray,
      filière: formDial.filière.value,
      prix: formDial.prix.value,
      stock: formDial.stock.value,
    };
    var promise = [];
    for (let i of arrayFile) {
      promise.push(this.addFile(produit, i));
    }
    Promise.all(promise).then(() => {
      this.addactivity(produit).then(() => {
        formDial.prix.value = "";
        formDial.stock.value = "";
        formDial.unit.value = null;
        formDial.photo.value = "";
        formDial.filière.value = "";
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
        this.list(setProduit).then(() => {
          setStatus("Tâche finis");
          setProgress(false);
        });
      });
    });
  }
  async addFile(produit, i) {
    const fichiers = document.getElementById("dialogform").photo.files;
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `images/${produit.filière}/${fichiers[i].name}`
    );
    await uploadBytesResumable(storageRef, fichiers[i]);
  }
  async addactivity(a) {
    try {
      await addDoc(collection(getFirestore(app), "produit"), a);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  }
  async list(a) {
    const produit = await this.querydoc("produit");
    var tab = [];
    for (let act of produit) {
      var tab1 = [];
      for (let img of act.contenu.photo) {
        const path = "images/" + act.contenu.filière + "/" + img;
        const downloadedurl = await this.downurl(path);
        tab1.push(downloadedurl);
      }
      tab.push({
        id: act.id,
        stock: act.contenu.stock,
        unit: act.contenu.unit,
        prix: act.contenu.prix,
        photo: tab1,
        filière: act.contenu.filière,
        files: act.contenu.photo.join(","),
      });
    }
    a(tab);
  }
  async downurl(str) {
    const storage = getStorage(app);
    const refStorage = ref(storage, str);
    const download = await getDownloadURL(refStorage);
    return download;
  }
  async updateProduit(form, id) {
    const prod = doc(getFirestore(app), "produit", id);
    await updateDoc(prod, form);
  }
  async deleteProduit(id, str, files) {
    const prod = doc(getFirestore(app), "produit", id);
    await deleteDoc(prod);
    const img = files.split(",");
    for (let a of img) {
      const storageRef = ref(getStorage(app), "images/" + str + "/" + a);
      await deleteObject(storageRef);
    }
  }
}
