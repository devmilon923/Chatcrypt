import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:4000");
export default function Home() {
  const [connection, setConnection] = useState({
    status: true,
    message: "Connect Room",
  });
  const [message, setMessage] = useState();
  const roomRef = useRef(null);
  const messageRef = useRef(null);
  const nameRef = useRef(null);

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!nameRef.current.value) return alert("Need Your Name");
    if (!roomRef.current.value) return alert("Need Room Name");
    socket.emit("messageEvent", {
      name: nameRef.current.value,
      message: messageRef.current.value,
      room: roomRef.current.value,
    });
    messageRef.current.value = null;
  };
  useEffect(() => {
    socket.on("sendResponseEvent", (payload) => {
      setMessage(payload);
      setConnection({ ...connection, message: "Join another room" });
    });
  }, []);

  const join = () => {
    setConnection({ ...connection, message: "Connecting..." });
    socket.emit("joinRoom", {
      name: nameRef.current.value,
      room: roomRef.current.value,
    });
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <input
            type="text"
            ref={nameRef}
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your name"
          />
          <input
            type="text"
            ref={roomRef}
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type room name"
          />
          <div className="text-center">
            <button
              onClick={join}
              className="btn btn-sm rounded-md bg-green-500 hover:bg-green-600 text-white mb-2"
            >
              {connection?.message}
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-4">Message Form</h1>
          <form className="flex gap-2 items-center" onSubmit={handleMessage}>
            <input
              type="text"
              ref={messageRef}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
            />
            <button className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white">
              Send
            </button>
          </form>
          <div className="mt-4 p-3 border rounded bg-gray-50">
            {message
              ? message.map((msg, index) => (
                  <p key={index} className="text-gray-700">
                    {msg.name}: {msg.message}
                  </p>
                ))
              : "No Message"}
          </div>
        </div>
      </div>
    </div>
  );
}
