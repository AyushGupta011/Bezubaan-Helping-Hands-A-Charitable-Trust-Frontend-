import { useState } from "react";

const WEBHOOK_URL = import.meta.env.VITE_CHATBOT || 'http://localhost:8000';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 🐾 I’m Bezubaan Assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;


    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${WEBHOOK_URL}/rag/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory // Send the existing history
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Server error");

      const botReply = data.reply;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply },
      ]);


      setChatHistory((prev) => [...prev, [userMessage, botReply]]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I’m a bit busy right now. Please try again shortly 🐶",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <button style={styles.fab} onClick={() => setOpen(!open)}>
        🐾
      </button>


      {open && (
        <div style={styles.chatbox}>
          <div style={styles.header}>
            Ask Bezubaan
            <span style={styles.close} onClick={() => setOpen(false)}>✕</span>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  background: msg.sender === "user" ? "#000" : "#f2f2f2",
                  color: msg.sender === "user" ? "#fff" : "#000",
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div style={styles.typing}>Typing…</div>}
          </div>

          <div style={styles.inputBox}>
            <input
              style={styles.input}
              value={input}
              placeholder="Ask about adoption..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={styles.send} onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}


const styles = {

  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "#fff",
    border: "2px solid #000",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 9999,
  },
  chatbox: {
    position: "fixed",
    bottom: 85,
    right: 20,
    width: 320,
    height: 420,
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #ddd",
    boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    zIndex: 9999,
  },
  header: {
    padding: 12,
    background: "#000",
    color: "#fff",
    fontWeight: 600,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  close: {
    cursor: "pointer",
    fontSize: 14,
  },
  messages: {
    flex: 1,
    padding: 10,
    background: "#fafafa",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  message: {
    padding: "8px 12px",
    borderRadius: 12,
    maxWidth: "80%",
    fontSize: 14,
    lineHeight: 1.4,
  },
  typing: {
    fontSize: 12,
    color: "#666",
    padding: 5,
  },
  inputBox: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ddd",
    gap: 6,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },
  send: {
    padding: "8px 14px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
};