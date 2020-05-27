window.addEventListener("load", () => load());

async function load() {
  const elements = getElements();
  const users = await fetchData();
  const input = elements.input;
  const button = elements.button;
  setUpSearchBar(input, button);
  searchUsers(input, button, users);
}

function setUpSearchBar(input, button) {
  input.focus();
  button.disabled = true;
}

function getElements() {
  const input = document.querySelector(".form-control");
  const button = document.querySelector(".btn");
  return { input, button };
}

async function fetchData() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  let users = json.results.map((user) => {
    return {
      name: `${user.name.first} ${user.name.last}`,
      picture: user.picture.medium,
      age: user.dob.age,
      gender: user.gender,
    };
  });
  return users;
}

function searchUsers(input, button, users) {
  let sortedUsers = users.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  //Transformar nomes da lista para lowerCase

  function updateList() {
    let inputValue = input.value;
    sortedUsers = sortedUsers.filter((user) => user.name.includes(inputValue));
    renderUsers(sortedUsers);
    renderStats(sortedUsers);
  }

  input.addEventListener("keyup", (event) => {
    button.disabled = false;
    if (event.key === "Backspace") {
      updateList();
    }
    if (input.value === "") {
      button.disabled = true;
    }
    updateList();
  });
}

function renderUsers(users) {
  const usersTitle = document.querySelector(".users-title");
  const usersDiv = document.querySelector(".results-list");

  usersTitle.textContent = `${users.length} usuário(s) encontrado(s)`;
  let usersHTML = "<div>";
  users.forEach((user) => {
    const { name, picture, age, gender } = user;
    const userHTML = `
        <div id="${gender}" class="user-container">
            <img src="${picture}">
            <span>${name}, </span>
            <span>${age} anos</span>
        </div>
    `;
    usersHTML += userHTML;
    usersDiv.innerHTML = usersHTML;
  });
  usersHTML += "</div>";
}

function renderStats(users) {
  function calculateStats() {
    let maleArr = [];
    let femaleArr = [];

    maleArr = users.map((user) => {
      return user.gender === "male";
    });

    femaleArr = users.map((user) => {
      return user.gender === "female";
    });

    let maleCount = maleArr.filter((bool) => bool === true).length;
    let femaleCount = femaleArr.filter((bool) => bool === true).length;

    let somaIdades = users.reduce((acc, user) => {
      return acc + user.age;
    }, 0);
    let mediaIdades = Math.floor(somaIdades / users.length);

    return { maleCount, femaleCount, somaIdades, mediaIdades };
  }

  const statsTitle = document.querySelector(".stats-title");
  const statsDiv = document.querySelector(".stats-list");
  let getStats = calculateStats();
  statsTitle.textContent = `Estatísticas`;
  statsDiv.innerHTML = `<span>Sexo masculino: ${getStats.maleCount}</span>
  <span>Sexo feminio: ${getStats.femaleCount}</span>
  <span>Soma das idades: ${getStats.somaIdades}</span>
  <span>Média das idades: ${getStats.mediaIdades}</span>
  `;
}
