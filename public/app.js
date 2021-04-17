const categoryDropdown = document.querySelector(".category");

if (categoryDropdown)
  categoryDropdown.addEventListener("change", (e) => {
    if (e.target.value === "create-new-category") {
      const modal = document.querySelector("#new-category-modal");
      modal.classList.toggle("is-active");
    }
  });

const newCategoryModalCloseBtn = document.querySelector(
  "#new-category-modal-close"
);

if (newCategoryModalCloseBtn)
  newCategoryModalCloseBtn.addEventListener("click", () => {
    const modal = document.querySelector("#new-category-modal");
    modal.classList.toggle("is-active");
  });
