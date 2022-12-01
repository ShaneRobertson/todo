// Dom Elements ========================
const openSignInModal = document.getElementById("nav-signin-btn");
const closeSignInModal = document.getElementById("siginin-modal-close");
const signInModalOverlay = document.getElementById("signin-modal-overlay");
const signInModalContainer = document.getElementById("signin-modal-container");
const signInModalDetails = document.getElementById("signin-modal-details");
const signInModalCancelBtn = document.getElementById("signin-modal-cancel-btn");
const logOutBtn = document.getElementById("nav-logout-btn");
const todoOutputArea = document.getElementById("todo-output-area");
const tableContainer = document.querySelector("table");
const displayedName = document.getElementById("nav-displayed-username");
// const currentTodoContainer = document.getElementById(
//   "current-todo-inner-container"
// );
// const expiredTodoContainer = document.getElementById(
//   "expired-todo-inner-container"
// );
// const completedTodoContainer = document.getElementById(
//   "completed-todo-inner-container"
// );
const signinUsername = document.getElementById("floatingUsername");
const signinPassword = document.getElementById("floatingPassword");
const signinBtn = document.getElementById("signin-modal-submit");

const date = new Date();
const year = date.toLocaleString("default", { year: "numeric" });
const month = date.toLocaleString("default", { month: "2-digit" });
const day = date.toLocaleString("default", { day: "2-digit" });
const currentDate = `${year}-${month}-${day}`;
console.log(currentDate);
// Functions ========================================
const getTodos = async (user_id) => {
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
    todoOutputArea.innerHTML = "";
    todos.reverse().forEach((todo) => {
      const { title, due_date, status, priority, todo_id } = todo;
      const badge_color = determineBadgeColor(due_date, status);
      const badge_description =
        badge_color == "success"
          ? "Completed"
          : badge_color == "primary"
          ? "In Progress"
          : "Expired";
      let date = due_date.slice(0, due_date.indexOf("T"));

      todoOutputArea.insertAdjacentHTML(
        "afterend",
        `
      <tr data-id=${todo_id}>
      <th scope="row">${title}</th>
      <td>${date}</td>
      <td><span class="badge bg-${badge_color}">${badge_description}</span></td>
      <td>${priority}</td>
      </tr>
      `
      );
    });
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

const determineBadgeColor = (dueDate, curStatus) => {
  let isExpired = currentDate > dueDate;
  console.log("isExpired: ", isExpired);
  let statusBadge = curStatus == "inProgress" ? "primary" : "success";

  return isExpired ? "danger" : statusBadge;
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
  todoOutputArea.innerHTML = "";
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
    openSignInModal.style.display = "none";
    logOutBtn.style.display = "block";
  } catch (err) {
    console.log("Error in login user: ", err);
  }

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

tableContainer.addEventListener("click", async (e) => {
  console.dir(e.target);
  try {
    if (e.target.dataset) {
      console.log(e.target.dataset);
      let todoId = e.target.parentElement.dataset.id;
      console.log("todoID is: ", todoId);
      // const result = await updateTodo(todoId);

      // await getTodos(2);
    }
    if (e.target.dataset.action == "complete") {
      console.log("complete lisener");
      let todoId = e.target.parentElement.dataset.id;
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
