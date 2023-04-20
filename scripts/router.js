document.querySelectorAll(".tabs__btn").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    const id = e.target.getAttribute("href").replace("#", "");

    document
      .querySelectorAll(".tabs__btn")
      .forEach((btn) => btn.classList.remove("is-active"));

    document
      .querySelectorAll(".main__tabs-content")
      .forEach((tab) => tab.classList.remove("is-active"));

    if (
      item.classList.contains("featured__btn") ||
      item.classList.contains("intro__btn")
    ) {
      document.getElementById("products").classList.add("is-active");
      document.getElementById("tab-2").classList.add("is-active");
    } else {
      item.classList.add("is-active");
      document.getElementById(id).classList.add("is-active");
    }
  });
});

document.querySelector(".tabs__btn").click();
