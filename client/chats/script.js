// const baseURL = "http://43.204.35.216";
const baseURL = "http://localhost:4000";
let token = localStorage.getItem("token");
userCred = JSON.parse(localStorage.getItem("Harmonious"));
let userID = userCred.id;
let userName = userCred.name;
const availableUser = [];
// import io from "socket.io-client";
const socket = io.connect("http://localhost:4040");

// const socket = io();
let room = "";

const msgerWindow = get(".msger");
const msgerForm = get(".msger-inputarea");
const msgerInputText = get(".msger-input");
const msgerInputFile = get(".msger-file-input");
const msgerChat = get(".msger-chat");
const msgerHeader = get(".msger-header");
const msgerHeaderTitle = get(".msger-header-title");
const grpList = get(".people-groups");

const PERSON_IMG =
  "https://images.unsplash.com/photo-1688378911966-ff12184b2680?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80";

window.addEventListener("DOMContentLoaded", () => {
  getUserFromDb();
  getGroupsFromDb();
});

document.getElementById("user-info-username").innerText = userName;

function renderGroupList(grpName, grpImg, grpID) {
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
}

function renderChatWindow(grpName, grpImg, grpID) {
  room = grpID;
  socket.emit("join_room", room);
  //   Simple solution for small apps
  const chatHeaderHTML = `<img
    class="people-group-info-img"
    src=${grpImg}
    alt="people-group"
    /> ${grpName}
  
  `;
  // console.log(grpName, grpID, grpImg);
  const msgerHeaderOptions = document.createElement("div");
  msgerHeaderOptions.className = "msger-header-options";
  const spanOptionElement = document.createElement("span");
  spanOptionElement.setAttribute("data-group-id", grpID);
  spanOptionElement.addEventListener("click", (event) =>
    showAddUserModal(event, grpID)
  );
  spanOptionElement.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
  msgerHeaderOptions.append(spanOptionElement);

  msgerWindow.style.display = "flex";
  msgerChat.innerHTML = "";
  msgerForm.style.display = "flex";
  msgerForm.setAttribute("data-group-id", grpID);
  msgerHeaderTitle.innerHTML = chatHeaderHTML;
  msgerHeader.style.display = "flex";
  msgerHeader.innerHTML = "";
  msgerHeader.append(msgerHeaderTitle, msgerHeaderOptions);
  getChatsFromDb(grpID);
  renderGroupInfo(grpName, grpImg, grpID);
}
msgerForm.addEventListener("submit", (event) => sendMsgToDB(event));

function appendMessage(groupID, name, img, side, time, msg, type) {
  //   Simple solution for small apps
  // console.log(msgerChat);
  const grpID = msgerForm.dataset.groupId;
  // console.log(grpID, groupID, msg, type, time);
  let content = "";
  if (type == "text") {
    content = `<div class="msg-text">${msg}</div>`;
  } else if (type == "image") {
    content = `<div class="msg-text">
    <img src=${msg} alt="image" style="max-width: 270px; max-height: 270px; border-radius: 10px;">
  </div>`;
  } else if (type == "video") {
    content = `<div class="msg-text"><video width="220px" controls>
  <source src=${msg} type="video/mp4">
</video>  </div>`;
    // "https://ia802704.us.archive.org/24/items/t-f_23/The%20Flash.mp4"
  }

  const msgHTML = `
  <div class="msg ${side}-msg">
  
  <div class="msg-img" style="background-image: url(${img})"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${time}</div>
        </div>

        ${content}
      </div>
    </div>
  `;
  if (grpID === groupID) {
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
  }
}

function renderGroupInfo(grpname, grpImg, grpID) {
  const grpInfoDetails = document.getElementById("group-info-details");
  grpInfoDetails.style.visibility = "visible";
  const groupIcon = document.getElementById("group-icon");
  const groupName = document.getElementById("group-name");

  groupIcon.innerHTML = `<img
  class="group-icon-img"
  src=${grpImg}
  alt="people-group"
  />`;

  groupName.innerHTML = `<h3>${grpname}</h3>`;
  renderGroupUserList(grpID);
}

async function renderGroupUserList(groupID) {
  try {
    const res = await axios.get(baseURL + "/group/" + groupID + "/users", {
      headers: { Authorization: token },
    });
    // console.log(res.data);
    const grpuserlist = res.data;
    const grpUserListUL = document.getElementById("group-user-list-ul");
    grpUserListUL.className = "list-group p-0 m-0";
    grpUserListUL.innerHTML = "";
    grpuserlist.forEach((user) => {
      const userlielem = document.createElement("li");
      userlielem.className =
        "d-flex justify-content-between align-items-center p-1 m-1 rounded bg-secondary-subtle";

      const userName = document.createElement("div");
      userName.innerText = user.user.name;

      const userAction = document.createElement("div");
      const adminBtn = document.createElement("button");
      adminBtn.className = "btn btn-sm btn-primary me-2";
      adminBtn.textContent = "Admin";
      adminBtn.setAttribute("data-user-id", user.user.id);
      adminBtn.setAttribute("data-group-id", groupID);
      adminBtn.addEventListener("click", (event) => makeUserAdmin(event));

      const deleteUserBtn = document.createElement("button");
      deleteUserBtn.className = "btn btn-sm btn-warning";
      deleteUserBtn.textContent = "Delete";
      deleteUserBtn.setAttribute("data-user-id", user.user.id);
      deleteUserBtn.setAttribute("data-group-id", groupID);
      deleteUserBtn.addEventListener("click", (event) =>
        deleteUserFromGroup(event)
      );

      if (user.user.id !== userID) {
        if (!user.admin) {
          userAction.append(adminBtn, deleteUserBtn);
        }
        userlielem.append(userName, userAction);
      } else {
        userlielem.append(userName);
      }
      // console.log(user.admin);

      grpUserListUL.appendChild(userlielem);
    });
  } catch (err) {
    console.log(err);
  }
}

async function makeUserAdmin(event) {
  const buttonEle = event.target;
  const groupID = buttonEle.dataset.groupId;
  const userId = buttonEle.dataset.userId;

  try {
    const res = await axios.get(
      baseURL + `/group/${groupID}/makeAdmin/${userId}`,
      {
        headers: { Authorization: token },
      }
    );
    if (res.data.success) renderGroupUserList(groupID);
  } catch (err) {
    window.alert("Cant make user admin");
  }
}

async function deleteUserFromGroup(event) {
  const buttonEle = event.target;
  const groupID = buttonEle.dataset.groupId;
  const userId = buttonEle.dataset.userId;

  try {
    const res = await axios.delete(
      baseURL + `/group/${groupID}/deleteUser/${userId}`,
      {
        headers: { Authorization: token },
      }
    );
    if (res.data.success) renderGroupUserList(groupID);
  } catch (err) {
    window.alert("Cant delete user from group");
  }
}

function showAddUserModal(event, groupID) {
  const buttonEle = event.target;
  // const groupID = buttonEle.dataset.groupId;

  console.log("showUserModal  ", groupID);
  // const userId = buttonEle.dataset.userId;

  const userList = document.getElementById("userListAddGroup");

  // Clear any previous list items
  userList.innerHTML = "";

  // Create and append list items for each available user
  availableUser.forEach((user) => {
    console.log(user.name, user.id);
    if (user.id !== userID) {
      const li = document.createElement("li");
      li.classList.add("list-group-item");

      // User name
      const userNameElement = document.createElement("span");
      userNameElement.textContent = user.name;
      li.appendChild(userNameElement);

      // Button
      const addButton = document.createElement("button");
      addButton.textContent = "Add";
      addButton.classList.add("btn", "btn-success", "mx-2");
      addButton.setAttribute("data-user-id", user.id);
      addButton.setAttribute("data-group-id", groupID);
      addButton.addEventListener("click", (event) => addUsersToGroup(event));
      li.appendChild(addButton);

      userList.appendChild(li);
    }
  });

  // Show the modal
  const userModal = new bootstrap.Modal(document.getElementById("userModal"));
  userModal.show();
}

async function addUsersToGroup(event) {
  const buttonEle = event.target;
  const groupID = buttonEle.dataset.groupId;
  const userId = buttonEle.dataset.userId;
  console.log(groupID, userId);
  try {
    const res = await axios.post(
      baseURL + `/group/${groupID}/addUser`,
      { userIds: userId },
      {
        headers: { Authorization: token },
      }
    );
    if (res.data.success) renderGroupUserList(groupID);
  } catch (err) {
    window.alert("Cant add user");
  }
}

function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const meridiem = hours >= 12 ? "PM" : "AM";

  const formattedHours = (hours % 12 === 0 ? 12 : hours % 12)
    .toString()
    .padStart(2, "0");

  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${meridiem}`;
}

async function sendMsgToDB(event) {
  event.preventDefault();
  const form = event.target;
  const groupID = form.dataset.groupId;

  const msgText = msgerInputText.value;
  const msgFile = msgerInputFile.files[0];

  console.log("msgFile", msgFile);

  if (msgText) {
    // const date =
    const messageObj = {
      name: userName,
      message: msgText,
      date: formatDate(new Date()),
      type: "text",
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
      sendMsgRT(messageObj, groupID);
      // console.log("msg REspoinse", res);
      appendMessage(
        groupID,
        res.data.chat.name,
        PERSON_IMG,
        "right",
        res.data.chat.date,
        msgText,
        "text"
      );
      msgerInputText.value = "";
    } catch (err) {
      console.log(err);
      window.alert("Database Error");
    }
  }

  if (!msgFile) {
    console.log("Not a file");
    return;
  } else {
    const formData = new FormData();
    formData.append("name", userName);
    formData.append("message", msgFile);
    formData.append("roomID", groupID);
    formData.append("date", formatDate(new Date()));
    formData.append("type", "image");
    console.log("Called sendFile FormData", formData);
    try {
      const res = await axios.post(
        baseURL + "/chat/upload",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      console.log(res.data);
      const imageObj = {
        name: res.data.chat.name,
        message: res.data.chat.message,
        date: res.data.chat.date,
        type: res.data.chat.type,
        roomID: groupID,
      };
      sendMsgRT(imageObj, groupID);
      appendMessage(
        groupID,
        res.data.chat.name,
        PERSON_IMG,
        "right",
        res.data.chat.date,
        res.data.chat.message,
        res.data.chat.type
      );
      msgerInputFile.value = "";
    } catch (err) {
      console.log(err);
      window.alert("Database Error");
    }
  }
}

// setInterval(getChatsFromDb, 5000);

async function getChatsFromDb(groupID) {
  try {
    const res = await axios.get(baseURL + "/chat/get/" + groupID, {
      headers: { Authorization: token },
    });
    let chats = res.data.chats;
    // console.log(res.data.success, chats, chats.length);

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
          chat.date,
          chat.message,
          chat.type
        );
      else
        appendMessage(
          groupID,
          chat.name,
          PERSON_IMG,
          "left",
          chat.date,
          chat.message,
          chat.type
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
    // console.log(res.data);
    let users = res.data.users;
    // console.log(res.data.success, chats, chats.length);

    users.forEach((user) => {
      availableUser.push(user);
      if (user.id !== userID) {
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
      }
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

  const groupName = document.getElementById("groupName").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const selectedUsers = Array.from(form.elements.users)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

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
    data.message.date,
    data.message.message,
    data.message.type
  );
  console.log(data);
});
