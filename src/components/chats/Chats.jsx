import EmojiPicker from 'emoji-picker-react';
import './chatsstyle.css';
import { useEffect, useRef, useState } from 'react';
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"
import { db } from "../../firebase_Lib/Firebase";
import { UserchateStore } from "../../firebase_Lib/Userchatstore"
import { useUserStore } from '../../firebase_Lib/Userstore';
const Chats = () => {
  const [emoji, setemoji] = useState(false);
  const [Text, setText] = useState('');
  const [chat, setchat] = useState();
  const{currentUser} =useUserStore();
  const { chatId,user } = UserchateStore();
  const endref = useRef(null);
  const userIDs=[currentUser.id,user.id]
  useEffect(() => {
    endref.current?.scrollIntoView({ behavior: "smooth" })
  }, [])
  useEffect(() => {
    const onsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setchat(res.data())
    })
    return () => { onsub() }
  }, [chatId])
  const handleemoji = () => {
    setemoji(!emoji);

  }
  const handletext=async()=>{
if(Text==="") return;
try {
  await updateDoc(doc(db,"chats",chatId),{
   messages:arrayUnion({
    senderId:currentUser.id,
    Text,
    createdAt:new Date(),

   })
  })
  userIDs.forEach(async(id)=>{
    const UserChatRef=doc(db,"userchat",id)
  const UserChatSnapshot=await getDoc(UserChatRef)
  if(UserChatSnapshot.exists()){
    const userChatdata =UserChatSnapshot.data()
    const chatINdex=userChatdata.chats.findIndex(c=>c.chatId===chatId)
    userChatdata.chats[chatINdex].lastmessage=Text
    userChatdata.chats[chatINdex].isSeen=id===currentUser.id?true:false
    userChatdata.chats[chatINdex].updateAt = Date.now();

    await updateDoc(UserChatRef,{chats:userChatdata.chats,})
  }
  })
  
} 
catch (error) {
  console.log(error.message)
}
  }
  const handleinput = (e) => {
    setText(e.target.value)
  }
  const handleclick = (e) => {

    setText(Text + e.emoji)

  }
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>name</span>
            <p>fwfafaffa</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>

      </div>
      <div className="center">
        { chat?.messages?.map((message)=><div className="message owner"  key={message?.createAt}>
          <div className="text">
            {message.img && <img src={message.img}/>}
            <p>{message.Text}</p>
            {/* <span>{message.creatAt</span> */}
          </div>
        </div>)}
        <div ref={endref}>

        </div>

      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder='type here...' value={Text} onChange={handleinput} />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={handleemoji} />
          <div className="pickcontainer">
            {emoji ? <EmojiPicker onEmojiClick={handleclick} /> : null}
          </div>
        </div>
        <button className='sendbtn' onClick={handletext}> send</button>
      </div>
    </div>
  );
}

export default Chats;

