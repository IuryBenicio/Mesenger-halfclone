// login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

// Chat Elements
const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

let websocket;

function getRandomColor() {
  const RandomIndex = Math.floor(Math.random() * colors.length);
  return colors[RandomIndex];
}

const user = { id: "", name: "", color: "" };

function scrollScreen() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

function createMessageSelfElement(content) {
  const div = document.createElement("div");
  div.classList.add("message--self");
  div.innerHTML = content;
  return div;
}

function createMessageOtherElement(content, senderColor, sender) {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");
  //   div.classList.add("message--self");
  span.classList.add("message--sender");
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
}

function processMesage({ data }) {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userColor, userName);

  chatMessages.appendChild(message);
  scrollScreen();
}

function handleLogin(evento) {
  evento.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("ws://localhost:8080");

  websocket.onmessage = processMesage;
}

function sendMessage(event) {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));

  chatInput.value = "";
}

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
