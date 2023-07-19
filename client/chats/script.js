const baseURL = "http://localhost:4000";
let token = localStorage.getItem("token");
userCred = JSON.parse(localStorage.getItem("Harmonious"));
let userID = userCred.id;
let userName = userCred.name;
// import io from "socket.io-client";
const socket = io.connect("http://localhost:4040");

// const socket = io();
let room = "";

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const msgerHeader = get(".msger-header");
// const msgerChatWindow = get(".msger-chat");
const grpList = get(".people-groups");

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
  getUserFromDb();
  getGroupsFromDb();
  // getChatsFromDb();
  // for (let i = 0; i < 15; i++) {
  //   renderGroupList(
  //     `Sharpner -${i}`,
  //     "https://images.unsplash.com/photo-1689611947724-c02161745093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  //   );
  // }
});

document.getElementById("user-info-username").innerText = userName;

function renderGroupList(grpName, grpImg, grpID) {
  //   Simple solution for small apps
  const grpHTML = `<div class="people-group-info-wrapper" onclick="renderChatWindow('${grpName}', '${grpImg}', '${grpID}')">

  <div class="people-group-info" data-id=${grpID}>
    <img
    class="people-group-info-img"
    src="${grpImg}"
    />
    <div class="people-group-info-text">
      <div class="people-group-info-title">${grpName}</div>
     
    </div>
  </div>
</div>
  `;

  grpList.insertAdjacentHTML("beforeend", grpHTML);
  // grpList.scrollTop += 500;
}

function renderChatWindow(grpName, grpImg, grpID) {
  room = grpID;
  socket.emit("join_room", room);
  //   Simple solution for small apps
  const chatHeaderHTML = `
  <div class="msger-header-title">
    <img
    class="people-group-info-img"
    src=${grpImg}
    alt="people-group"
    /> ${grpName}
  </div>
  <div class="msger-header-options">
    <span><i class="fa-solid fa-user-plus"></i></span>
  </div>
  `;
  msgerChat.innerHTML = "";
  msgerForm.setAttribute("data-group-id", grpID);
  msgerHeader.innerHTML = chatHeaderHTML;
  getChatsFromDb(grpID);
}
msgerForm.addEventListener("submit", (event) => sendMsgToDB(event));

function appendMessage(groupID, name, img, side, time, text) {
  //   Simple solution for small apps
  // console.log(msgerChat);
  const grpID = msgerForm.dataset.groupId;
  console.log(grpID, groupID);
  if (grpID !== groupID) {
  }
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${time}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  if (grpID === groupID) {
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
  }
}
// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Determine if it's AM or PM
  const meridiem = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = (hours % 12 === 0 ? 12 : hours % 12)
    .toString()
    .padStart(2, "0");

  // Format minutes
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Return the formatted time
  return `${formattedHours}:${formattedMinutes} ${meridiem}`;
}

async function sendMsgToDB(event) {
  event.preventDefault();
  const form = event.target;
  const groupID = form.dataset.groupId;

  const msgText = msgerInput.value;
  if (!msgText) return;

  const messageObj = {
    name: userName,
    message: msgText,
    roomID: groupID,
  };
  try {
    const res = await axios.post(
      baseURL + "/chat/add",

      messageObj,
      {
        headers: { Authorization: token },
      }
    );
    sendMsgRT(messageObj, room);
    appendMessage(
      groupID,
      res.data.chat.name,
      PERSON_IMG,
      "right",
      formatDate(new Date()),
      msgText
    );
    msgerInput.value = "";
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }

  // botResponse();
}

// setInterval(getChatsFromDb, 5000);

async function getChatsFromDb(groupID) {
  try {
    const res = await axios.get(baseURL + "/chat/get/" + groupID, {
      headers: { Authorization: token },
    });
    let chats = res.data.chats;
    console.log(res.data.success, chats, chats.length);

    chats.forEach((chat) => {
      // console.log(
      //   `Name: ${chat.name}\n Message: ${chat.message} \n user: ${chat.userId}`
      // );
      // console.log("userId  ", userID);
      if (chat.userId == userID)
        appendMessage(
          groupID,
          chat.name,
          PERSON_IMG,
          "right",
          formatDate(new Date()),
          chat.message
        );
      else
        appendMessage(
          groupID,
          chat.name,
          PERSON_IMG,
          "left",
          formatDate(new Date()),
          chat.message
        );
    });
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }
}

async function getUserFromDb() {
  try {
    const res = await axios.get(baseURL + "/user/all", {
      headers: { Authorization: token },
    });
    console.log(res.data);
    let users = res.data.users;
    // console.log(res.data.success, chats, chats.length);

    users.forEach((user) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "users";
      checkbox.value = user.id;
      checkbox.id = `user_${user.id}`;

      const label = document.createElement("label");
      label.htmlFor = `user_${user.id}`;
      label.appendChild(document.createTextNode(user.name));

      const div = document.createElement("div");
      div.appendChild(checkbox);
      div.appendChild(label);

      userList.appendChild(div);
    });
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }
}

async function getGroupsFromDb() {
  try {
    const res = await axios.get(baseURL + "/group/get", {
      headers: { Authorization: token },
    });
    const groups = res.data.groups;

    groups.forEach((group) => {
      renderGroupList(group.name, group.iconURL, group.id);
    });

    // console.log(res.data.success, chats, chats.length);
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }
}

const form = document.getElementById("createGroupForm");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Retrieve form values
  const groupName = document.getElementById("groupName").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const selectedUsers = Array.from(form.elements.users)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  // Do something with the form data
  // (e.g., send an AJAX request to create the group)
  console.log("Group Name:", groupName);
  console.log("Image URL:", imageUrl);
  console.log("Selected Users:", selectedUsers);

  const groupOBJ = {
    groupName: groupName,
    imageURL: imageUrl,
    users: selectedUsers,
  };
  try {
    const res = await axios.post(baseURL + "/group/add", groupOBJ, {
      headers: { Authorization: token },
    });
    window.location.reload();
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }

  // Close the modal
  $("#createGroupModal").modal("hide");
});

async function sendMsgRT(message, room) {
  await socket.emit("send_message", { message, room });
}

socket.on("receive_message", (data) => {
  // setMessageReceived(data.message);
  appendMessage(
    data.room,
    data.message.name,
    PERSON_IMG,
    "left",
    formatDate(new Date()),
    data.message.message
  );
  console.log(data);
});

async function addnewGroup() {}
