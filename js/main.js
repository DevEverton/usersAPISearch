window.addEventListener("load", () => {
  const elements = getElements();
  fetchData();
});

function getElements() {
  const inputSearch = document.querySelector(".form-control");
  const searchButton = document.querySelector(".btn");
  return [inputSearch, searchButton];
}

function fetchData() {}

function handleButton(button) {
  input.addEventListener("keyup", () => {
    console.log(input.value);
  });
}
