// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLytktrYFelTNrqrfQ7RDB0D8yJisM85k",
  authDomain: "neurogit-a3d94.firebaseapp.com",
  projectId: "neurogit-a3d94",
  storageBucket: "neurogit-a3d94.firebasestorage.app",
  messagingSenderId: "87703437480",
  appId: "1:87703437480:web:1490482ffab5971b0fc29d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)


export async function uploadFile(file: File, setProgress?: (progress:number) => void) {
    return new Promise((resolve,reject) => {
        try{

            const storageRef = ref(storage,file.name)
            const uploadTask = uploadBytesResumable(storageRef,file)
            uploadTask.on('state_changed',snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                if(setProgress) setProgress(progress)

                    switch(snapshot.state){
                        case 'paused':
                            console.log('upload is paused'); break
                        case 'running':
                            console.log('upload is running'); break;   
                }
            }, error => {
                reject(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                    resolve(downloadUrl as string)
                })
            })
        }catch(error)
        {
            console.log(error);
            reject(error)
        }
    })
}