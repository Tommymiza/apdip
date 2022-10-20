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
  orderBy,
  limit,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import app from "../firebase/db";
export class activity {
  static getPostInstance() {
    const instance = new activity();
    return instance ? instance : new activity();
  }
  async ajout(
    formDial,
    fichiers,
    setActivite,
    setStatus,
    setProgress,
    setActivities
  ) {
    setProgress(true);
    setStatus("");
    const arrayFile = Object.keys(fichiers);
    const newDate = new Date(formDial.date.value);
    const month =
      newDate.getMonth() + 1 < 10
        ? "0" + (newDate.getMonth() + 1)
        : newDate.getMonth() + 1;
    const day =
      newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    const exactDate = newDate.getFullYear() + "-" + month + "-" + day;
    var pathArray = [];
    arrayFile.forEach((file) => {
      pathArray = [...pathArray, fichiers[file].name];
    });
    const activity = {
      date: exactDate,
      description: formDial.descri.value,
      images: pathArray,
      filière: formDial.select.value,
      place: formDial.lieu.value,
      title: formDial.titre.value,
      path: formDial.titre.value + formDial.lieu.value + exactDate,
    };
    var promise = [];
    for (let i of arrayFile) {
      promise.push(this.addFile(activity, exactDate, i, arrayFile));
    }
    Promise.all(promise).then(() => {
      this.addactivity(activity).then(() => {
        formDial.titre.value = "";
        formDial.lieu.value = "";
        formDial.descri.value = "";
        formDial.date.value = null;
        formDial.images.value = "";
        setActivite("");
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
        this.list(setActivities).then(() => {
          setStatus("Tâche finis");
          setProgress(false);
        });
      });
    });
  }
  async addFile(activity, exactDate, i) {
    const fichiers = document.getElementById("dialogform").images.files;
    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `images/${activity.title + activity.place + exactDate}/${
        fichiers[i].name
      }`
    );
    await uploadBytesResumable(storageRef, fichiers[i]);
  }
  async addactivity(a) {
    try {
      await addDoc(collection(getFirestore(app), "activity"), a);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  }
  async demarrer(setActivities) {
    const activity = await this.queryDoc("activity");
    var tab = [];
    for (let act of activity) {
      var tab1 = [];
      for (let img of act.contenu.images) {
        const path = "images/" + act.contenu.path + "/" + img;
        const downloadedurl = await this.downurl(path);
        tab1.push(downloadedurl);
      }
      tab.push({
        id: act.id,
        date: act.contenu.date,
        description: act.contenu.description,
        images: tab1,
        place: act.contenu.place,
        title: act.contenu.title,
        filière: act.contenu.filière,
      });
    }
    setActivities(tab);
  }
  async list(a) {
    const activity = await this.querydoc("activity");
    var tab = [];
    for (let act of activity) {
      var tab1 = [];
      for (let img of act.contenu.images) {
        const path = "images/" + act.contenu.path + "/" + img;
        const downloadedurl = await this.downurl(path);
        tab1.push(downloadedurl);
      }
      tab.push({
        id: act.id,
        date: act.contenu.date,
        description: act.contenu.description,
        images: tab1,
        place: act.contenu.place,
        title: act.contenu.title,
        filière: act.contenu.filière,
        path: act.contenu.path,
        files: act.contenu.images.join(","),
      });
    }
    let temp = tab.sort((a,b)=>a.date.localeCompare(b.date))
    a(temp);
  }
  async querydoc(str) {
    const database = getFirestore(app);
    const activity = collection(database, str);
    const q = query(activity, orderBy("title", "asc"));
    const document = await getDocs(q);
    var act = [];
    document.docs.forEach((item) => {
      act = [...act, { id: item.id, contenu: item.data() }];
    });
    return act;
  }
  async queryDoc(str) {
    const database = getFirestore(app);
    const activity = collection(database, str);
    const q = query(activity, orderBy("date", "desc"), limit(2));
    const document = await getDocs(q);
    var act = [];
    document.docs.forEach((item) => {
      act = [...act, { id: item.id, contenu: item.data() }];
    });
    return act;
  }
  async downurl(str) {
    const storage = getStorage(app);
    const refStorage = ref(storage, str);
    const download = await getDownloadURL(refStorage);
    return download;
  }
  async updateActivity(form, id) {
    const activ = doc(getFirestore(app), "activity", id);
    await updateDoc(activ, form);
  }
  async delete(id, str, files) {
    const activ = doc(getFirestore(app), "activity", id);
    await deleteDoc(activ);
    const img = files.split(",");
    for (let a of img) {
      const storageRef = ref(getStorage(app), "images/" + str + "/" + a);
      await deleteObject(storageRef);
    }
  }
}
