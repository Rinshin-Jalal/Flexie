import React from "react";
import useUserStore from "../store/user";
import NotLoggedIn from "../components/NotLoggedIn";
import { useNavigate } from "react-router-dom";
import { useReadChannelState, useDirectMessage } from "@onehop/react";
import "./Connect.scss";

const Chat = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const connectUser = useUserStore((state) => state.connectUser);

  const [error, setError] = React.useState(null);
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = React.useState("");
  const { state } = useReadChannelState("default");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = React.useState(false);

  useDirectMessage("JOIN_REQUEST", (message) => {
    setMessages((m) => [...m, message]);
  });

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  if (success) {
    navigate(`/chat/${success.data}`);
  }

  return (
    <div className="connect">
      <h1>Chat?</h1>

      <p>Do you want to chat with ppl with same interests</p>

      <button
        onClick={async () => {
          setSuccess(await connectUser({ setError, setLoading }));
        }}
        disabled={loading}
        className={"connect__button"}
      >
        Find a chat partner
      </button>

      {messages &&
        messages.map((m) => (
          <p key={m.channelId}>
            <a href={`/chat/${m.channelId}`}>JOIN the chat with {m.name}</a>
          </p>
        ))}
    </div>
  );
};

export default Chat;
