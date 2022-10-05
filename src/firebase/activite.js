import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, getFirestore, collection } from "firebase/firestore";
import app from "../components/db";
export class activity {
  static getPostInstance() {
    const instance = new activity();
    return instance ? instance : new activity();
  }
  async ajout(formDial, fichiers, setProgress, setStatus,setActivite) {
    setStatus("");
    setProgress(true);
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
    };
    var promise = [];
    for (let i of arrayFile) {
      promise.push(this.addFile(activity, exactDate, i, arrayFile));
    }
    Promise.all(promise).then(() => {
      this.addactivity(activity).then(() => {
        setProgress(false);
        setStatus("Tâche fini");
        setActivite('');
        formDial.titre.value = "";
        formDial.lieu.value = "";
        formDial.descri.value = "";
        formDial.date.value = null;
        formDial.images.value = "";
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
}