import "./adduser.css";
import { useUserStore } from "../../firebase_Lib/Userstore";
import { db } from "../../firebase_Lib/Firebase"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
const Adduser = () => {
    const [user, setUser] = useState(null)
    const { currentUser } = useUserStore();
    const adduser = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username")
        
        try {
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username));

            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }
            else {
                console.log("No user found with the provided username.");
            }

        } catch (err) {
            console.log(err);
        }
    }
    const handleadd = async () => {
        const chatref = collection(db, "chats");
        const userchatref = collection(db, "userchat")
        try {
            const newref = doc(chatref)
            await setDoc(newref, {
                createdAt: serverTimestamp(),
                messages: []

            })
            await updateDoc(doc(userchatref, user.id), {
                chats: arrayUnion({
                    chatId: newref.id,
                    lastmessage: "",
                    receiverId: currentUser.id,
                    updateAt: Date.now()
                })
            })
            await updateDoc(doc(userchatref, currentUser.id), {
                chats: arrayUnion({
                    chatId: newref.id,
                    lastmessage: "",
                    receiverId: user.id,
                    updateAt: Date.now()
                })
            })
        } catch (error) {
            console.log(error.message)

        }
    }
    return (

        <div className="adduser">
            <form onSubmit={adduser}>
                <input type="text" placeholder="username" name="username" className="username" />
                <button>search</button>
            </form>
            {user && <div className="user">
                <div className="details">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleadd}>Adduser</button>
            </div>}

        </div>
    );
}

export default Adduser;
