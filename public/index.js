// Dom Elements ========================
const openSignInModal = document.getElementById("nav-signin-btn");
const closeSignInModal = document.getElementById("siginin-modal-close");
const signInModalOverlay = document.getElementById("signin-modal-overlay");
const signInModalContainer = document.querySelector("#signin-modal-container");
const signInModalDetails = document.querySelector("#signin-modal-details");
const signInModalCancelBtn = document.querySelector("#signin-modal-cancel-btn");
const logOutBtn = document.getElementById("nav-logout-btn");
const todoOutputArea = document.querySelector("#todo-output");
const displayedName = document.getElementById("nav-displayed-username");
const currentTodoContainer = document.getElementById(
  "current-todo-inner-container"
);
const expiredTodoContainer = document.getElementById(
  "expired-todo-inner-container"
);
const completedTodoContainer = document.getElementById(
  "completed-todo-inner-container"
);
const signinUsername = document.getElementById("floatingUsername");
const signinPassword = document.getElementById("floatingPassword");
const signinBtn = document.getElementById("signin-modal-submit");

const date = new Date();
const year = date.toLocaleString("default", { year: "numeric" });
const month = date.toLocaleString("default", { month: "2-digit" });
const day = date.toLocaleString("default", { day: "2-digit" });
const currentDate = `${year}-${month}-${day}`;

// Functions ========================================
const getTodos = async (user_id) => {
  // console.log(user_id);
  currentTodoContainer.innerHTML = "";
  expiredTodoContainer.innerHTML = "";
  completedTodoContainer.innerHTML = "";

  try {
    const result = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ user_id }),
    });

    const todos = await result.json();

    todos.reverse().forEach((element) => {
      let endOfDate = element.due_date.indexOf("T");
      let currentOrExpired =
        element.due_date.slice(0, endOfDate) > currentDate
          ? currentTodoContainer
          : expiredTodoContainer;

      if (element.is_complete) {
        completedTodoContainer.insertAdjacentHTML(
          "beforeend",
          `<div class='todo-card ${
            element.due_date.slice(0, endOfDate) > currentDate
              ? "expired"
              : "upcoming"
          }'>
                    <div id='todo-card-header-container'>
                        <div id='todo-card-date-indicator-outer'>
                            <div id='date-indicator-inner'>
                              <div id='due-date-indicator-${
                                element.due_date.slice(0, endOfDate) >
                                currentDate
                                  ? "upcoming"
                                  : "expired"
                              }'></div>
                              <span id='todo-date'>Due: ${element.due_date.slice(
                                0,
                                endOfDate
                              )}</span>
                            </div>
                        </div>  

                    
                        <div id='todo-card-controls'>
                        <div class='todo-card-btns delete' data-action='delete' data-id=${
                          element.todo_id
                        }>&#10006;</div>
                        <div class='todo-card-btns complete' data-action='complete' data-id=${
                          element.todo_id
                        }>&#10004;</div>
                        <div class='todo-card-btns edit' data-action='edit' data-id=${
                          element.todo_id
                        }>&#9998;</div>
                      </div>
                              
                  </div>
                    <h3>${element.title}</h3>
                    <p id='todo-description'>${element.description}</p>
            </div>
        `
        );
      } else {
        currentOrExpired.insertAdjacentHTML(
          "beforeend",
          `<div class='todo-card ${
            element.due_date.slice(0, endOfDate) > currentDate
              ? "expired"
              : "upcoming"
          }'>
              <div id='todo-card-header-container'>
                  <div id='todo-card-date-indicator-outer'>
                      <div id='date-indicator-inner'>
                        <div id='due-date-indicator-${
                          element.due_date.slice(0, endOfDate) > currentDate
                            ? "upcoming"
                            : "expired"
                        }'></div>
                        <span id='todo-date'>Due: ${element.due_date.slice(
                          0,
                          endOfDate
                        )}</span>
                      </div>
                  </div>  

                    <div id='todo-card-controls'>
                      <div class='todo-card-btns delete' data-action='delete' data-id=${
                        element.todo_id
                      }>&#128465;</div>
                      <div class='todo-card-btns complete' data-action='complete' data-id=${
                        element.todo_id
                      }>&#10004;</div>
                      <div class='todo-card-btns edit' data-action='edit' data-id=${
                        element.todo_id
                      }>&#9998;</div>
                    </div>
                              
                  </div>
                    <h3>${element.title}</h3>
                    <p id='todo-description'>${element.description}</p>
            </div>
        `
        );
      }
    });
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

const deleteTodo = async (todo_id) => {
  try {
    await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ todo_id }),
    });

    // HARDCODED USER ID HERE =========================

    // console.log("outcome is: ", outcome);
  } catch (err) {
    console.log("error in deleteTodo Function: ", err);
  }
};

const updateTodo = async (todo_id) => {
  try {
    const result = await fetch("/api/complete", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_id,
      }),
    });

    const updatedTodo = await result.json();
    // await getTodos(2);
    console.log("updated todo is: ", updatedTodo);
  } catch (err) {
    console.log("updateTodo Error: ", err);
  }
};

const loginUser = async (username, password) => {
  try {
    const result = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const userObj = await result.json();

    return userObj;
  } catch (err) {
    console.log("Error in loginUser: ", err);
  }
};

const clearOutputArea = () => {
  currentTodoContainer.innerHTML = "";
  expiredTodoContainer.innerHTML = "";
  completedTodoContainer.innerHTML = "";
};

const clearSignInError = () => {
  const errMessage = document.getElementById("signin-error");
  if (errMessage) {
    errMessage.innerText = "";
  }
};

const setLocalStorage = (token, userObject) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userObject", JSON.stringify(userObject));
};
// Event Listeners ====================================
openSignInModal.addEventListener("click", () => {
  signInModalOverlay.style.display = "block";
});

closeSignInModal.addEventListener("click", () => {
  signinUsername.value = "";
  signinPassword.value = "";
  signInModalOverlay.style.display = "none";
  clearSignInError();
});

signinBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = signinUsername.value;
  const password = signinPassword.value;
  if (!username || !password) return;

  try {
    const userObj = await loginUser(username, password);

    if (userObj.message) {
      signinPassword.insertAdjacentHTML(
        "afterend",
        `<div id='signin-error'>${userObj.message}</div>`
      );
      signinUsername.value = "";
      signinPassword.value = "";
      return;
    }
    const { token, verifiedUser } = userObj;
    setLocalStorage(token, verifiedUser);
    displayedName.innerText = verifiedUser.username;
    await getTodos(verifiedUser.user_id);
    signInModalOverlay.style.display = "none";
    console.log("signInModal: ", signInModalOverlay);
    openSignInModal.style.display = "none";
    console.log("logout button: ", logOutBtn);
    logOutBtn.style.display = "block";
  } catch (err) {
    console.log("Error in login user: ", err);
  }

  console.log("username is: ", username, "password is: ", password);
  signinUsername.value = "";
  signinPassword.value = "";
});

signinUsername.addEventListener("input", () => {
  clearSignInError();
});

signinPassword.addEventListener("input", () => {
  clearSignInError();
});

logOutBtn.addEventListener("click", () => {
  openSignInModal.style.display = "block";
  displayedName.innerText = "Guest";
  localStorage.clear();
  logOutBtn.style.display = "none";
  clearOutputArea();
});

todoOutputArea.addEventListener("click", async (e) => {
  try {
    if (e.target.dataset.action == "delete") {
      console.log("delete listener");
      let todoId = e.target.dataset.id;
      const result = await deleteTodo(todoId);

      await getTodos(2);
    }
    if (e.target.dataset.action == "complete") {
      console.log("complete lisener");
      let todoId = e.target.dataset.id;
      console.log(todoId);
      const result = await updateTodo(todoId);
      console.log(
        "flag: ",
        JSON.parse(localStorage.getItem("userObject")).user_id
      );
      const todosAfterComplete = await getTodos(
        JSON.parse(localStorage.getItem("userObject")).user_id
      );
      console.log("💡💡💡💡💡💡", todosAfterComplete);
    }
  } catch (err) {
    console.log("Error in delete deleteTodo listener =>", err);
  }
});

// getTodos(2);
