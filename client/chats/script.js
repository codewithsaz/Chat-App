const baseURL = "http://localhost:4000";
let token = localStorage.getItem("token");

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :(",
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

window.addEventListener("DOMContentLoaded", () => {
  getChatsFromDb();
});

msgerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  const messageObj = {
    message: msgText,
  };
  try {
    const res = await axios.post(
      baseURL + "/chat/add",

      messageObj,
      {
        headers: { Authorization: token },
      }
    );
    console.log(res.data.success, res.data.chat);

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }

  botResponse();
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

setInterval(getChatsFromDb, 5000);

async function getChatsFromDb() {
  try {
    const res = await axios.get(baseURL + "/chat/get", {
      headers: { Authorization: token },
    });
    let chats = res.data.chats;
    console.log(res.data.success, chats, chats.length);

    chats.forEach((chat) => {
      // console.log(
      //   `Name: ${chat.name}\n Message: ${chat.message} \n user: ${chat.userId}`
      // );
      if (chat.userId === 1)
        appendMessage(chat.name, PERSON_IMG, "right", chat.message);
      else appendMessage(chat.name, PERSON_IMG, "left", chat.message);
    });
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }
}
