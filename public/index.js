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
const openDeleteModal = document.getElementById("delete-modal-icon");
const confirmDelete = document.getElementById("confirm-delete");
const deleteModalBody = document.getElementById("delete-modal-body");
const createTodoBtn = document.getElementById("create-todo-button");
const createTodoTitle = document.getElementById("create-todo-title");
const createTodoDate = document.getElementById("create-todo-date");

const date = new Date();
const year = date.toLocaleString("default", { year: "numeric" });
const month = date.toLocaleString("default", { month: "2-digit" });
const day = date.toLocaleString("default", { day: "2-digit" });
const currentDate = `${year}-${month}-${day}`;

// ============== Functions ====================

const getTodos = async (user_id) => {
  todoOutputArea.innerHTML = "";

  try {
    console.log("fetching todos");
    const result = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ user_id }),
    });
    console.log("got a result: ", result);
    const todos = await result.json();
    console.log("jsoning a result: ", todos);
    localStorage.setItem("todos", JSON.stringify(todos));

    todos.forEach((todo) => {
      const { title, due_date, status, todo_id } = todo;
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
      <td><svg  id="edit-modal-icon" data-id=${todo_id} class="text-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-action='edit' =xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path data-action='edit' data-id=${todo_id} d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path data-action='edit' data-id=${todo_id} fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
    data-bs-toggle="modal"
    data-bs-target="#staticBackdropDelete"
    data-id=${todo_id}
    id="delete-modal-icon"
    data-action='delete'
  class="bi bi-x-circle text-danger" viewBox="0 0 16 16" >
  <path data-action='delete' data-id=${todo_id} d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path data-action='delete' data-id=${todo_id}  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>
    </td>
      </tr>
      `
      );
    });
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

const getTodoById = async (id) => {
  try {
    const result = await fetch("/api/todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: {
        id,
      },
    });

    return result.json();
  } catch (error) {
    console.log("getTodoById error: ", error);
  }
};

const determineBadgeColor = (dueDate, curStatus) => {
  let isExpired = currentDate > dueDate;
  console.log("isExpired: ", isExpired);
  let statusBadge = curStatus == "inProgress" ? "primary" : "success";

  return isExpired ? "danger" : statusBadge;
};

const createTodo = async (title, due_date, user_id) => {
  debugger;
  try {
    const result = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        due_date,
        user_id,
      }),
    });
    const todos = await result.json();
    console.log(todos);
  } catch (error) {
    console.log("createTodo error: ", error);
  }
};

const deleteTodo = async (todo_id) => {
  try {
    const result = await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ todo_id }),
    });

    return result.json();
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        todo_id,
        title,
        due_date,
      }),
    });

    const updatedTodo = await result.json();
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

const getTodoTitle = (id) => {
  JSON.parse(localStorage.getItem("todos")).forEach((todo) => {
    if (todo.todo_id === id) {
      deleteModalBody.innerText = "";
      deleteModalBody.innerText = todo.title;
    }
  });
};

// Event Listeners ====================================

openSignInModal.addEventListener("click", () => {
  signInModalOverlay.style.display = "block";
  signinUsername.focus();
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
    createTodoBtn.removeAttribute("disabled");
    console.log("hsdfasdfas");
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
  createTodoBtn.setAttribute("disabled", "true");
  localStorage.clear();
  logOutBtn.style.display = "none";
  clearOutputArea();
});

tableContainer.addEventListener("click", async (e) => {
  // console.dir(e.target);
  let todoId = e.target.dataset.id;

  try {
    if (e.target.dataset.action == "edit") {
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

    if (e.target.dataset.action == "delete") {
      JSON.parse(localStorage.getItem("todos")).forEach((todo) => {
        if (todo.todo_id == todoId) {
          deleteModalBody.innerHTML = `<p id='delete-todo-title' data-id=${todoId}>${todo.title}</p>`;
        }
      });
      console.log(todoId);
    }
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
  if (!newTitle && !newDate) return;
  try {
    const result = await updateTodo(todoId, newTitle, newDate);

    console.log("SUCCESSSSSS: ", result);
  } catch (err) {
    console.log("Close edit modal error: ", err);
  }
});

confirmDelete.addEventListener("click", async (e) => {
  let todoId = document.getElementById("delete-todo-title").dataset.id;
  console.log("confirm delete todoID: ", todoId);
  const result = await deleteTodo(todoId);
  console.log("Delete Todo result => ", result);
  await getTodos(JSON.parse(localStorage.getItem("userObject")).user_id);
});

createTodoBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    if (!localStorage.getItem("token")) return;
    const title = createTodoTitle.value;
    const due_date = createTodoDate.value;
    const user_id = JSON.parse(localStorage.getItem("userObject")).user_id;
    console.log("userId local storage: ", user_id);
    if (!title || !due_date) {
      console.log(title, due_date, user_id);
      return;
    }
    console.log(title, due_date, user_id);
    const result = await createTodo(title, due_date, user_id);
    await getTodos(user_id);
    createTodoTitle.value = "";
    createTodoDate.value = "";
  } catch (error) {
    console.log("create todo error: ", error);
  }
});
