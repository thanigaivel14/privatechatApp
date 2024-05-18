import { useEffect } from "react";
import Chats from "./components/chats/Chats"
import Details from "./components/details/Details"
import List from "./components/list/List"
import Login from "./components/login/Login";
import Notifi from "./components/notification/Notifi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase_Lib/Firebase";
import { useUserStore } from "./firebase_Lib/Userstore";
import { UserchateStore } from "./firebase_Lib/Userchatstore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = UserchateStore();  
  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    })
    return () => { onSub(); }
  }, [fetchUserInfo])

  if (isLoading) {
    return <div className="isloading">
      LOADING....
    </div>
  }
  

  return (

    <div className='container'>
      {currentUser ? (<>
        <List />
        {chatId && <Chats />}
        {chatId && <Details />}
      </>) : (<Login />)}
      <Notifi />
    </div>
  )
}

export default App