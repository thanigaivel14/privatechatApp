import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import{createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { auth,db } from "../../firebase_Lib/Firebase";
import { doc, setDoc } from "firebase/firestore";
import Upload from "../../firebase_Lib/Upload";

const Login = () => {
    const [loading,setloading]=useState(false);
    const [avatar, setavatar] = useState({ file: null, url: "" });
    const handleavatar = (e) => {
        if (e.target.files[0]) {
            setavatar({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })
            console.log(file.name);
        }
    }
    const handlelogin= async(e)=>{
            setloading(true);
        e.preventDefault();
        try{
            const formdata=new FormData(e.target);
        const {Email,password}=Object.fromEntries(formdata);
        console.log(Email)
        console.log(password)
          await  signInWithEmailAndPassword(auth,Email,password)
          
          toast.success("logged in");
        }
        catch(err){
            toast.error(err.message);
            console.log(err.message)
        }
        finally{
            setloading(false);
        }
    }
    

    const handleregister= async(e)=>{
        e.preventDefault();
        setloading(true)
        console.log(loading);
        const formdata=new FormData(e.target);
        const {username,Email,pass}=Object.fromEntries(formdata);
        try{
   const res=await createUserWithEmailAndPassword(auth,Email,pass);
   const imageurl= await Upload(avatar.file);
   await setDoc(doc(db,"users",res.user.uid),{
    username,
    email:Email,
    id:res.user.uid,
    avatar:imageurl,
    blocked:[]
})
await setDoc(doc(db,"userchat",res.user.uid),{
    chats:[],
})
   toast.success("Login successful "+username)
        }
        catch(err){
            toast.error(err.message);
        }
        finally{
            setloading(false);
        }
    }
    return (
        <div className="login">
            <div className="item">
                <form  onSubmit={handlelogin}>
                    <h2>welcome back</h2>
                    <input type="text"required  placeholder="email" name="Email" />
                    <input type="password" required placeholder="password" name="password" />
                    <button disabled={loading}  > login</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <form onSubmit={handleregister} >
                    <h2>create id</h2>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />upload a profile</label>
                    <input type="file"  required style={{ display: "none" }} onChange={handleavatar} id="file" />
                    <input type="text" required  placeholder="username" className="username" name='username'/>
                    <input type="text"required  placeholder="email" name="Email" />
                    <input type="password" placeholder="password" name="pass" />
                    <button disabled={loading} > Register</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
