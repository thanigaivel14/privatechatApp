import React, { useEffect, useState } from 'react';
import './liststyle.css';
import './userinfo.css';
import './chatliststyle.css';
import Adduser from './Adduser';
import { useUserStore } from '../../firebase_Lib/Userstore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase_Lib/Firebase';
import { UserchateStore } from '../../firebase_Lib/Userchatstore';

const List = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const [add, setAdd] = useState(false);
  const { chatId,changeChat } = UserchateStore();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "userchat", currentUser.id), async (res) => {
      const items = res.data().chats;
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser.id]);

 
  const handleSelect = async (chat) => {
    console.log("chatId:", chatId); 
    console.log("chat.user:", chat.user); 

 const userChats=chats.map(item=>{
  const{user,...rest}=item
  return rest;
 })
 const chatIndex=userChats.findIndex(item=>{item.chatId===chat.chatId})
 console.log(userChats.chats[chatIndex].isSeen)
 userChats[chatIndex].isSeen=true;
 
 const userchatref= doc(db,"userchat",currentUser.id)
 try {
  await updateDoc(userchatref,{chats:userChats,})
  changeChat(chat.chatId,chat.user)
  
 } catch (error) {
  console.log(error.message)
  
 }
    
  }

  return (
    <div className='list'>
      <div className='userinfo'>
        <div className="user">
          <img src={currentUser.avatar || "../avatar.png"} alt="" />
          <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
          <img src="../more.png" alt="" />
          <img src="../video.png" alt="" />
          <img src="../edit.png" alt="" />
        </div>
      </div>
      <div className='chatlist'>
        <div className="search">
          <div className="searchbar">
            <img src="./search.png" alt="" />
            <input type="text" />
          </div>
          <img src={add ? "../minus.png" : "../plus.png"} alt="" className='add' onClick={() => setAdd(!add)} />
        </div>
        {chats.map(chat => (
          <div className="items" key={chat.chatId} onClick={() => handleSelect(chat)} 
          style={{backgroundColor:chat?.isseen?"transparent": "#5183fe"}}>
            <img src={chat.user.avatar || "../avatar.png"} alt="" />
            <div className="text">
              <span>{chat.user.username}</span>
              <p>{chat.lastmessage}</p>
            </div>
          </div>
        ))}
      </div>
      {add && <Adduser />}
    </div>
  );
}

export default List;
