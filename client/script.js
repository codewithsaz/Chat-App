// const baseURL = "http://65.2.29.156:4000";
const baseURL = "http://localhost:4000";

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

document.getElementById("signUpEmail").addEventListener("input", () => {
  document.getElementById("signUpErrorMessenger").innerHTML = ``;
});

var signUpForm = document.getElementById("signUpForm");
var signInForm = document.getElementById("signInForm");
var forgotpassForm = document.getElementById("forgotPasswordForm");
signUpForm.addEventListener("submit", signUpUser);
signInForm.addEventListener("submit", signInUser);
forgotpassForm.addEventListener("submit", forgotPassword);

async function signUpUser(e) {
  e.preventDefault();

  var signUpObj = {
    name: document.getElementById("signUpName").value,
    email: document.getElementById("signUpEmail").value,
    phone: document.getElementById("signUpPhone").value,
    password: document.getElementById("singUpPassword").value,
  };

  try {
    const res = await axios.post(baseURL + "/user/signup", signUpObj);
    document.getElementById(
      "signUpErrorMessenger"
    ).innerHTML = `User account created, please login`;
  } catch (err) {
    // console.log(err.response.data);
    document.getElementById(
      "signUpErrorMessenger"
    ).innerHTML = `${err.response.data.message}`;
  }
}

async function signInUser(e) {
  e.preventDefault();

  var loginObj = {
    email: document.getElementById("signInEmail").value,
    password: document.getElementById("signInPassword").value,
  };

  try {
    const res = await axios.post(baseURL + "/user/login", loginObj);
    localStorage.setItem("token", res.data.token);
    window.location.href = "./dashboard/dashboard.html";
  } catch (err) {
    // console.log(JSON.stringify(err.response.data.message));
    document.getElementById(
      "loginErrorMessenger"
    ).innerHTML = `${err.response.data.message}`;
  }
}

async function forgotPassword(event) {
  event.preventDefault();
  // console.log("called add function");
  var emailObj = {
    email: $("#email-password-reset").val(),
  };
  try {
    const res = await axios.post(
      baseURL + "/password/forgotpassword",

      emailObj
      // {
      //   headers: { Authorization: token },
      // }
    );
    // console.log(res.data);
    document.getElementById(
      "resetResponseMessenger"
    ).innerHTML = `${res.data.message}`;
    // window.alert("Check your mail to reset your password" + res.data.message);
  } catch (err) {
    document.getElementById(
      "resetResponseMessenger"
    ).innerHTML = `${err.response.data.message}`;
  }
}
