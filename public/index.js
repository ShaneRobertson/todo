// Dom Elements ========================
const signInBtn = document.querySelector(".nav-signin-btn");
const signInModalOverlay = document.getElementById("signin-modal-overlay");
const signInModalContainer = document.querySelector("#signin-modal-container");
const signInModalDetails = document.querySelector("#signin-modal-details");
const signInModalCancelBtn = document.querySelector("#signin-modal-cancel-btn");
const todoOutputArea = document.querySelector("#todo-output");
const currentTodoContainer = document.getElementById(
  "current-todo-inner-container"
);
const expiredTodoContainer = document.getElementById(
  "expired-todo-inner-container"
);
const completedTodoContainer = document.getElementById(
  "completed-todo-inner-container"
);
const date = new Date();
const year = date.toLocaleString("default", { year: "numeric" });
const month = date.toLocaleString("default", { month: "2-digit" });
const day = date.toLocaleString("default", { day: "2-digit" });
const currentDate = `${year}-${month}-${day}`;

// Functions ========================================
const getTodos = async (user_id) => {
  console.log(user_id);
  currentTodoContainer.innerHTML = "";
  expiredTodoContainer.innerHTML = "";
  completedTodoContainer.innerHTML = "";
  try {
    const result = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    const todos = await result.json();
    console.log("result is: ", todos);
    todos.reverse().forEach((element) => {
      // console.log(element.todo_id);
      let endOfDate = element.due_date.indexOf("T");
      let currentOrExpired =
        element.due_date.slice(0, endOfDate) > currentDate
          ? currentTodoContainer
          : expiredTodoContainer;

      if (element.is_complete) {
        // completedTodoContainer.innerHTML = "";
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
                          <div class='todo-card-btns delete' data-delete>&#10006;</div>
                          <div class='todo-card-btns complete' data-complete>&#10004;</div>
                          <div class='todo-card-btns edit' data-edit>&#9998;</div>
                        </div>
                              
                  </div>
                    <h3>${element.title}</h3>
                    <p id='todo-description'>${element.description}</p>
            </div>
        `
        );
      } else {
        // currentOrExpired.innerHTML = "";
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
      }
    });
    // return todos;
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

const deleteTodo = async (todo_id, user_id) => {
  try {
    await fetch("/api/todo/delete", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ todo_id }),
    });
    // const outcome = await result.json();

    await getTodos(user_id);
    // console.log("outcome is: ", outcome);
  } catch (err) {
    console.log("error in deleteTodo Function: ", err);
  }
};
// const sortTodos = (todoArray) => {
//   let upcoming = [];
//   let expired = [];
//   let completed = [];
// };
// sortTodos([1, 2, 3]);

// Event Listeners ====================================

signInBtn.addEventListener("click", function () {
  signInModalOverlay.style.display = "block";
});

signInModalCancelBtn.addEventListener("click", () => {
  signInModalOverlay.style.display = "none";
});

todoOutputArea.addEventListener("click", async (e) => {
  console.log(e.target.dataset.action == "complete");
  if (e.target.dataset.action == "delete") {
    let todoId = e.target.dataset.id;
    const result = await deleteTodo(todoId);
    console.log("flag: ", result);
    await getTodos(2);
  }
  try {
  } catch (err) {
    console.log("Error in delete deleteTodo listener =>", err);
  }
});

getTodos(2);
