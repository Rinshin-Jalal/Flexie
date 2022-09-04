import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { hop } from "@onehop/client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nav from "./components/Nav";
import UpdateBio from "./pages/UpdateBio";
import { useReadChannelState } from "@onehop/react";
import { useChannelMessage } from "@onehop/react";
import Connect from "./pages/Connect";
import useUserStore from "./store/user";
import Chat from "./pages/Chat";

const channelId = "default";
function App() {
  const user = useUserStore((state) => state.user);

  hop.init({
    projectId: "project_NDk4OTE5ODExNjU4Mzg1NDU",
    token: user?.token,
  });
  const [chatMessages, setChatMessages] = useState([]);

  // in this example, USER_MESSAGE is an event that you'd send to the channel from your backend
  const msgs = useChannelMessage(channelId, "MSG", (message) => {
    setChatMessages((m) => [...m, message]);
  });

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Chat</h1>
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Connect />} />
        <Route path="/bio" element={<UpdateBio />} />
        <Route path="/chat/" element={<Connect />} />
        <Route path="/chat/:channelId" element={<Chat />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
