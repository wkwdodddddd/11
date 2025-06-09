const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const app = express(), server = http.createServer(app), io = socketIo(server);
let logs = [];

app.use(express.static("public"));
app.get("/logs", (req, res) => res.json(logs));

io.on("connection", socket => {
  const ip = socket.handshake.address;
  const time = new Date().toISOString();
  const id = Date.now();
  logs.push({ id, ip, time });
  let writeStream = fs.createWriteStream(`public/videos/${id}.webm`);
  console.log(`Connected: ${ip} at ${time}`);

  socket.on("video-chunk", data => writeStream.write(Buffer.from(data)));
  socket.on("end-stream", () => { writeStream.end(); socket.disconnect(true); });
});
server.listen(3000, () => console.log("listening on 3000"));
