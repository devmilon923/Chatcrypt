import moment from "moment";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Home() {
  const [chatInfo, setChatInfo] = useState([]);
  const [activeUser, setActiveUser] = useState([]);
  const [serverResponse, setServerResponse] = useState();
  const roomRef = useRef(null);
  const nameRef = useRef(null);
  const fileRef = useRef(null);
  const messageRef = useRef(null);
  const chatContainerRef = useRef(null);
  const joinRoom = () => {
    socket.emit("joinRoom", {
      room: roomRef.current.value,
      name: nameRef.current.value,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chatEvent", {
      name: nameRef.current.value,
      room: roomRef.current.value,
      message: messageRef.current.value,
      time: new Date(),
    });
    e.target.reset();
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!roomRef.current.value || !nameRef.current.value) {
      return alert("Room and name are required");
    }

    const file = fileRef.current.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      socket.emit("chatEvent", {
        name: nameRef.current.value,
        room: roomRef.current.value,
        filename: file.name,
        data: reader.result, // Base64 or ArrayBuffer
      });
    };

    fileRef.current.value = null;
  };

  useEffect(() => {
    socket.on("chatEvent", (data) => {
      setChatInfo(data);
    });
  }, []);
  useEffect(() => {
    socket.on("activeUserEvent", (data) => {
      setActiveUser(data);
    });
  }, []);
  useEffect(() => {
    socket.on("serverResponse", (data) => {
      setServerResponse(data);
    });
  }, [setServerResponse]);

  useEffect(() => {
    if (serverResponse) {
      if (serverResponse.type) {
        toast.success(serverResponse.message);
      } else {
        console.log(serverResponse);
        toast.error(serverResponse.message);
      }
    }
  }, [serverResponse]); // Dependency on serverResponse
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatInfo]);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Left Panel */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
        <input
          ref={nameRef}
          placeholder="Your Name"
          className="mb-4 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          ref={roomRef}
          placeholder="Room Name"
          className="mb-4 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white p-2 rounded mb-4 w-full hover:bg-blue-600 focus:outline-none"
        >
          Join Room
        </button>

        <form onSubmit={handleFileUpload} className="mb-4">
          <input ref={fileRef} type="file" className="mb-2 w-full text-sm" />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 focus:outline-none"
          >
            Upload File
          </button>
        </form>

        <div>
          {chatInfo.length > 0
            ? chatInfo.map(
                (file, index) =>
                  file.data && (
                    <div
                      key={index}
                      className="mb-2 p-2 border rounded bg-gray-50"
                    >
                      <p>{file?.name} uploaded:</p>
                      <a
                        href={file?.data}
                        download={file?.filename}
                        className="text-blue-500 underline"
                      >
                        {file?.filename}
                      </a>
                    </div>
                  )
              )
            : "No media shared"}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">Chat</h2>
        </div>
        <div ref={chatContainerRef} className="h-64 overflow-y-auto mb-4">
          {chatInfo.length > 0 ? (
            chatInfo.map((msg, index) => (
              <div key={index} className="mb-3">
                <div className="text-sm text-gray-500 mb-1">
                  {msg.name}{" "}
                  {msg.name.toLowerCase() ===
                    nameRef.current.value.toLowerCase() && "(You)"}{" "}
                  <span className="text-xs text-gray-400">
                    {moment(msg.time).fromNow()}
                  </span>
                </div>
                <div
                  className={`${
                    msg.name.toLowerCase() ===
                    nameRef.current.value.toLowerCase()
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-100"
                  } p-3 rounded-lg max-w-xs`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
        <form onSubmit={sendMessage}>
          <div className="flex items-center">
            <input
              ref={messageRef}
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Active Users Panel */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Online Users ({activeUser.length})
          </h2>
          <div className="space-y-2">
            {activeUser.length > 0 ? (
              activeUser.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-blue-100 rounded-lg font-semibold"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>{" "}
                  {user?.name}
                </div>
              ))
            ) : (
              <p>No one is active.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
