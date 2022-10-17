const signInBtn = document.querySelector(".nav-signin-btn");
const signInModalOverlay = document.getElementById("signin-modal-overlay");
const signInModalContainer = document.querySelector("#signin-modal-container");
const signInModalDetails = document.querySelector("#signin-modal-details");
const signInModalCancelBtn = document.querySelector("#signin-modal-cancel-btn");

signInBtn.addEventListener("click", function () {
  signInModalOverlay.style.display = "block";
});

signInModalCancelBtn.addEventListener("click", () => {
  signInModalOverlay.style.display = "none";
});
