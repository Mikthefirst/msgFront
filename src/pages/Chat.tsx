import React, { useEffect } from "react";
import MainLayout from '../components/layout/MainLayout';
import ConversationList from '../components/chat/ConversationList';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput'
import ConversationHeader from '../components/chat/ConversationHeader';
import { observer } from "mobx-react-lite";
import { useStore } from "../store/StoreContext";

const Chat: React.FC = observer(() => {
  const {  userStore } = useStore();

  useEffect(() => {
    if (!userStore.user) {
      userStore.fetchUserInfo();
      console.log("user fetched:", userStore.user);
    }
  }, []);


  return (
    <MainLayout sidebar={<ConversationList />}>
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 overflow-hidden">
          <ConversationHeader />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>
        <ChatInput />
      </div>
    </MainLayout>
  );
});

export default Chat;