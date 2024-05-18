import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import{storage} from'./Firebase.js'
 
const Upload = async (file) => {
    const date =new Date();
    const storageRef = ref(storage, `images/${date+file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                reject(error.message);

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    })
}
export default Upload