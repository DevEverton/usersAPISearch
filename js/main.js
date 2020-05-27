window.addEventListener("load", () => load());

async function load() {
  const elements = getElements();
  const users = await fetchData();
  const input = elements.input;
  const button = elements.button;

  input.focus();
  button.disabled = true;
  searchUsers();
  renderUsers(users);
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
      picture: user.picture.large,
      age: user.dob.age,
      gender: user.gender,
    };
  });
  return users;
}

function searchUsers() {}

function renderUsers(users) {
  const usersDiv = document.querySelector(".results-list");
  let usersHTML = "<div>";
  users.forEach((user) => {
    const { name, picture, age, gender } = user;
    const userHTML = `
        <div id="${gender}" class="user-container">
            <img src="${picture}">
            <span>${name}</span>
            <span>${age} anos</span>
        </div>
    `;
    usersHTML += userHTML;
    usersDiv.innerHTML = usersHTML;
  });
  usersHTML += "</div>";
}

function renderStats(stats) {}
