let button = document.querySelectorAll(".close-button");

button.forEach(function (closeButton) {
  closeButton.addEventListener("click", (ev) => {
    console.log(ev);
  });
});
