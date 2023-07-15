const baseURL = "http://localhost:4000";
let token = localStorage.getItem("token");
var tableBody = $("#chat tbody");

// document.getElementById("sendChatBtn").addEventListener("click", sendChat());
async function sendChat() {
  const message = document.getElementById("message").value;
  const messageObj = {
    message: message,
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
    showChat("", res.data.chat);
  } catch (err) {
    console.log(err);
    window.alert("Database Error");
  }
}

function showChat(id, chat) {
  console.log(id, chat);
  var row = $("<tr></tr>");
  row.attr("id", id);
  console.log("<td>" + chat.name + ": " + chat.message + "</td>");
  row.append("<td>" + chat.name + ": " + chat.message + "</td>");
  console.log("row appended");
  tableBody.append(row);
  console.log("table body appended");
  // if (id === "") window.location.reload();
}
