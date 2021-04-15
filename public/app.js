document.querySelector(".category").addEventListener("change", (e) => {
  if (e.target.value === "create-new-category") {
    const modal = document.querySelector("#new-category-modal");
    modal.classList.toggle("is-active");
  }
});

document
  .querySelector("#new-category-modal-close")
  .addEventListener("click", () => {
    const modal = document.querySelector("#new-category-modal");
    modal.classList.toggle("is-active");
  });
