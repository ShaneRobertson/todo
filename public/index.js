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
const signinUsername = document.getElementById("floatingUsername");
const signinPassword = document.getElementById("floatingPassword");
const signinBtn = document.getElementById("signin-modal-submit");

const openEditModal = document.getElementById("edit-modal-icon");
const editModalBody = document.getElementById("edit-modal");
const closeEditModal = document.getElementById("close-edit-modal");
const saveChanges = document.getElementById("save-changes");

const date = new Date();
const year = date.toLocaleString("default", { year: "numeric" });
const month = date.toLocaleString("default", { month: "2-digit" });
const day = date.toLocaleString("default", { day: "2-digit" });
const currentDate = `${year}-${month}-${day}`;

// Functions ========================================
const getTodos = async (user_id) => {
  debugger;
  todoOutputArea.innerHTML = "";
  console.dir(todoOutputArea);
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
        "afterbegin",
        `
      <tr>
      <th scope="row">${title}</th>
      <td>${date}</td>
      <td><span class="badge bg-${badge_color}">${badge_description}</span></td>
      <td><svg  id="edit-modal-icon" data-id=${todo_id} class="text-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path data-id=${todo_id} d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path data-id=${todo_id} fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg></td>
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
  } catch (err) {
    console.log("error in deleteTodo Function: ", err);
  }
};

const updateTodo = async (todo_id, title, due_date) => {
  try {
    const result = await fetch("/api/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_id,
        title,
        due_date,
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
    if (e.target.dataset.id) {
      let todoId = e.target.dataset.id;
      editModalBody.insertAdjacentHTML(
        "afterbegin",
        `
        <div data-id=${todoId}  id='edit-todo-id' class="form-floating mb-3">
        <input type="text" class="form-control" id="edit-title" placeholder="#">
        <label for="edit-title">New Title Here</label>
      </div>
      <label for="edit-date">Date</label>
      <input type="date" id="edit-date" />
      `
      );
    }
    // if (e.target.dataset.action == "complete") {
    //   console.log("complete lisener");
    //   let todoId = e.target.parentElement.dataset.id;
    //   console.log(todoId);
    //   const result = await updateTodo(todoId);
    //   console.log(
    //     "flag: ",
    //     JSON.parse(localStorage.getItem("userObject")).user_id
    //   );
    //   const todosAfterComplete = await getTodos(
    //     JSON.parse(localStorage.getItem("userObject")).user_id
    //   );
    //   console.log("💡💡💡💡💡💡", todosAfterComplete);
    // }
  } catch (err) {
    console.log("Error in in the table =>", err);
  }
});

closeEditModal.addEventListener("click", async (e) => {
  e.preventDefault();

  const { user_id } = JSON.parse(localStorage.getItem("userObject"));
  console.log("user_id is: ", user_id);
  editModalBody.innerHTML = "";
  await getTodos(user_id);

  // todoOutputArea.innerHTML = "";
});

saveChanges.addEventListener("click", async (e) => {
  const newTitle = document.getElementById("edit-title").value;
  const newDate = document.getElementById("edit-date").value;
  const todoId = document.getElementById("edit-todo-id").dataset.id;
  try {
    const result = await updateTodo(todoId, newTitle, newDate);
    const updatedTodo = await result.json();
    console.log("SUCCESSSSSS: ", updatedTodo);
  } catch (err) {
    console.log("Close edit modal error: ", err);
  }
});
