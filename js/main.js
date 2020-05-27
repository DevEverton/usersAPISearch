window.addEventListener("load", () => load());

async function load() {
  const elements = getElements();
  const users = await fetchData();
  const input = elements.input;
  const button = elements.button;
  setUpSearchBar(input, button);
  searchEngine(input, users);
  handleTyping(input, button, users);
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

function searchEngine(input, users) {
  if (users === []) {
    return;
  }
  let sortedUsers = users.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  sortedUsers.forEach((user) => {
    user.name = user.name.trim().toLowerCase();
  });

  let inputValue = input.value.toLowerCase();
  sortedUsers = sortedUsers.filter((user) => user.name.includes(inputValue));

  return sortedUsers;
}

function handleTyping(input, button, users) {
  function render(users) {
    renderUsers(users);
    renderStats(users);
  }

  //   function removeChilds() {
  //     const usersTitle = document.querySelector(".users-title");
  //     const statsTitle = document.querySelector(".stats-title");
  //     const usersDiv = document.querySelector(".results-list");
  //     const statsDiv = document.querySelector(".stats-list");
  //     usersDiv.innerHtml = ``;
  //     statsDiv.innerHTML = ``;
  //     usersTitle.textContent = "Nenhum Usuário Filtrado";
  //     statsTitle.textContent = "Nada a ser exibido";
  //   }

  input.addEventListener("keyup", () => {
    button.disabled = false;
    if (input.value === "") {
      //   removeChilds();
      button.disabled = true;
      render(searchEngine(input, []));
    } else {
      render(searchEngine(input, users));
    }
  });
}

function renderUsers(users) {
  const usersTitle = document.querySelector(".users-title");
  const usersDiv = document.querySelector(".results-list");

  String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/^.|\s\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  usersTitle.textContent = `${users.length} usuário(s) encontrado(s)`;
  let usersHTML = "<div>";
  users.forEach((user) => {
    const { name, picture, age, gender } = user;
    const userHTML = `
        <div id="${gender}" class="user-container">
            <img src="${picture}">
            <span>${name.capitalize()}, </span>
            <span>${age} anos</span>
        </div>
    `;
    usersHTML += userHTML;
  });
  usersDiv.innerHTML = usersHTML;
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

    let mediaIdades = null;
    if (users.length === 0) {
      mediaIdades = 0;
    } else {
      mediaIdades = (somaIdades / users.length).toFixed(2);
    }

    return { maleCount, femaleCount, somaIdades, mediaIdades };
  }

  const statsTitle = document.querySelector(".stats-title");
  const statsDiv = document.querySelector(".stats-list");
  let getStats = calculateStats();
  statsTitle.textContent = `Estatísticas`;
  statsDiv.innerHTML = `
  <span>Sexo masculino: ${getStats.maleCount}</span>
  <span>Sexo feminio: ${getStats.femaleCount}</span>
  <span>Soma das idades: ${getStats.somaIdades}</span>
  <span>Média das idades: ${getStats.mediaIdades}</span>
  
  `;
}
