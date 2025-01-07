import { useEffect, useRef, useState } from "react";

function Test() {
  const userId = "123";
  const otherUserId = "456";

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatSocket = useRef(null); // Use ref for WebSocket to avoid reinitialization.

  useEffect(() => {
    // Initialize WebSocket connection
    chatSocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/private/001/`
    );

    // Handle incoming messages
    chatSocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    // Handle WebSocket closure
    chatSocket.current.onclose = (event) => {
      console.error("Chat socket closed unexpectedly");
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (chatSocket.current) {
        chatSocket.current.close();
      }
    };
  }, [otherUserId]); // Dependency array ensures it runs when `otherUserId` changes.

  // Handle sending a message
  const sendMessage = () => {
    if (chatSocket.current && message.trim()) {
      chatSocket.current.send(
        JSON.stringify({
          sender: JSON.parse(localStorage.getItem('user'))['email'] || "User",
          message: message.trim(),
        })
      );
      setMessage(""); // Clear input field after sending.
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <div id="messages" className="w-screen h-48 bg-red-200">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}: </strong><span>{msg.message}</span>
          </p>
        ))}
      </div>
      <input
        type="text"
        id="message-input"
        className="border"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update message state on input change
        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Allow pressing "Enter" to send
      />
      <button id="send-button" onClick={sendMessage} className="bg-green-400">
        Send
      </button>
    </div>
  );
}

export default Test;
