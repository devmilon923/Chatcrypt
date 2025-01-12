# Chatcrypt | Secure Chat Application

This project is a lightweight and secure chat application designed to provide users with anonymous communication. The application ensures user privacy by temporarily storing chat data in server memory and automatically deleting it at 12 AM (GMT+6).

- **Live Site**: [Chatcrypt Live](https://github.com/devmilon923/Chatcrypt)
- **Backend Repository**: [Chatcrypt Backend](https://github.com/devmilon923/Chatcrypt-Backend)

## Features

- **Secure and Anonymous**: Chats are securely stored temporarily in server memory.
- **Automatic Deletion**: All messages are automatically erased daily at 12 AM (GMT+6) to ensure privacy.
- **Real-Time Communication**: Users can chat in real-time within rooms using WebSockets.
- **Status Monitoring**: The current server status is displayed (e.g., Active/Offline).
- **Efficient Hosting**: Hosted on Render, with a short activation time if the server is offline.
- **Media Sharing**: Users can upload and share images.

## Technologies Used

- **Backend**: Node.js, Express.js, and Socket.IO for handling server logic and real-time communication.
- **Frontend**: React.js for creating a dynamic and responsive user interface.
- **Styling**: Tailwind CSS for modern and customizable design.
- **Database**: Temporarily stored in server memory (no persistent database).
- **Hosting**: Render for scalable and efficient deployment.

## How to Run Locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/devmilon923/Chatcrypt.git
   cd secure-chat-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the server**:

   ```bash
   npm run server
   ```

4. **Start the client**:

   ```bash
   npm run client
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Hosting Information

- The application is hosted on Render.
- If the server is offline, it may take up to one minute to activate.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Thank you for using the Secure Chat Application!
