// Dom Elements ========================
const signInBtn = document.querySelector(".nav-signin-btn");
const signInModalOverlay = document.getElementById("signin-modal-overlay");
const signInModalContainer = document.querySelector("#signin-modal-container");
const signInModalDetails = document.querySelector("#signin-modal-details");
const signInModalCancelBtn = document.querySelector("#signin-modal-cancel-btn");
const todoOutputArea = document.querySelector("#todo-output");
console.log(todoOutputArea);
// Functions ========================================
const getTodos = async () => {
  try {
    const result = await fetch("/api/todos");
    const todos = await result.json();
    todos.reverse().forEach((element) => {
      todoOutputArea.insertAdjacentHTML(
        "afterbegin",
        `<div id='todoCard'>${element.title}</div>`
      );
    });
    return todos;
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

const sortTodos = (todoArray) => {
  let upcoming = [];
  let expired = [];
  let completed = [];
};
sortTodos([1, 2, 3]);

// Event Listeners ====================================

signInBtn.addEventListener("click", function () {
  signInModalOverlay.style.display = "block";
});

signInModalCancelBtn.addEventListener("click", () => {
  signInModalOverlay.style.display = "none";
});

getTodos();
