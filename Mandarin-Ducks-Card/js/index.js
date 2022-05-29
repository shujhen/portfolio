const gender = document.querySelector("#gender");
const cardBackground = document.querySelector(".card-bg");
gender.addEventListener("change", function () {
  if (gender.value === "female") {
    cardBackground.classList.remove("card-male-img");
    cardBackground.classList.add("card-female-img");
    document.body.classList.add('female');
  } else {
    cardBackground.classList.remove("card-female-img");
    cardBackground.classList.add("card-male-img");
    document.body.classList.remove('female');
  }
});
