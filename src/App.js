import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./styles.css";

const socket = io("http://localhost:3001");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const message = {
        text: inputValue,
        sender: "user"
      };
      socket.emit("message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInputValue("");
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "pc"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="input-container">
        <input
          type="text"
          placeholder="Type your message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
