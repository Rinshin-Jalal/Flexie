import React from "react";
import { useChannelMessage, useReadChannelState } from "@onehop/react";
import { useParams } from "react-router-dom";
import useUserStore from "../store/user";
import "./Chat.scss";

const Chat = () => {
  const { channelId } = useParams();

  const [messages, setMessages] = React.useState([]);
  const [messageText, setMessageText] = React.useState("");

  const sendMessage = useUserStore((state) => state.sendMessage);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const user = useUserStore((state) => state.user);
  const name = user.name;
  console.log("name", name);

  const { state } = useReadChannelState(channelId);

  useChannelMessage(channelId, "USER_MESSAGE", (message) => {
    // this will be called every time the USER_MESSAGE event is sent to this channel
    setMessages((m) => [...m, message]);
  });

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat">
      {state && (
        <header>
          <h1>Chat - {state.name}</h1>
          {state.commonInterests && (
            <p>Common interests : {state.commonInterests}</p>
          )}
        </header>
      )}
      <div className="messages">
        {messages &&
          messages.map((m, i) => {
            if (m.author_name === name) {
              return (
                <div key={i} className="you">
                  <p>{m.author_name}</p>
                  {m.content}
                </div>
              );
            }
            return (
              <div key={i}>
                <p>{m.author_name}</p>
                {m.content}
              </div>
            );
          })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSuccess(
            sendMessage({
              channelId,
              message: messageText,
              setError,
              setLoading,
            })
          );
          setMessageText("");
        }}
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <p>
        {error} <br /> {loading}{" "}
      </p>
    </div>
  );
};

export default Chat;
