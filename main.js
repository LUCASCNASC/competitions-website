

// Busca todas as competições da API
async function fetchCompetitionsFromAPI() {
  try {
    const resp = await fetch("http://localhost:3001/api/competitions");
    if (!resp.ok) return [];
    const data = await resp.json();
    return data;
  } catch {
    return [];
  }
}

// Busca todas as temporadas de uma competição
async function fetchSeasonsByCompetition(id_competition) {
  try {
    const resp = await fetch(`http://localhost:3001/api/competitions/${id_competition}/seasons`);
    if (!resp.ok) return [];
    const data = await resp.json();
    return data;
  } catch {
    return [];
  }
}

let competitions = [];
fetchCompetitionsFromAPI().then(apiCompetitions => {
  competitions = apiCompetitions;
});

const competitionInput = document.getElementById("competition-input");
const autocompleteList = document.getElementById("autocomplete-list");
const mainContent = document.getElementById("main-content");
const toast = document.getElementById("toast");
let currentFocus = -1;

// Função para filtrar a lista de competições
function filterCompetitions(val) {
  return competitions.filter((comp) => comp.name_championship.toLowerCase().includes(val.toLowerCase()));
}

// Exibe a lista de sugestões filtrada
function showAutocomplete(val) {
  autocompleteList.innerHTML = "";
  if (!val) {
    autocompleteList.classList.remove("show");
    return;
  }
  const filtered = filterCompetitions(val);
  if (filtered.length === 0) {
    autocompleteList.classList.remove("show");
    return;
  }
  filtered.forEach((comp, idx) => {
    const item = document.createElement("li");
    item.textContent = comp.name_championship;
    item.tabIndex = 0;
    item.addEventListener("mousedown", function(e) {
      competitionInput.value = comp.name_championship;
      competitionInput.dataset.competitionId = comp.id; // salva o id para buscar depois
      autocompleteList.classList.remove("show");
    });
    item.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        competitionInput.value = comp.name_championship;
        competitionInput.dataset.competitionId = comp.id;
        autocompleteList.classList.remove("show");
        competitionInput.focus();
      }
    });
    autocompleteList.appendChild(item);
  });
  autocompleteList.classList.add("show");
}

function closeAutocomplete() {
  autocompleteList.innerHTML = "";
  autocompleteList.classList.remove("show");
  currentFocus = -1;
}

competitionInput?.addEventListener("input", function(e) {
  showAutocomplete(this.value);
  this.dataset.competitionId = ""; // limpa id ao digitar
});

document.addEventListener("click", function(e) {
  if (!e.target.closest(".autocomplete")) {
    closeAutocomplete();
  }
});

competitionInput?.addEventListener("keydown", function(e) {
  const items = autocompleteList.getElementsByTagName("li");
  if (!autocompleteList.classList.contains("show")) return;
  if (e.key === "ArrowDown") {
    currentFocus++;
    if (currentFocus >= items.length) currentFocus = 0;
    updateActive(items);
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    currentFocus--;
    if (currentFocus < 0) currentFocus = items.length - 1;
    updateActive(items);
    e.preventDefault();
  } else if (e.key === "Enter") {
    if (currentFocus > -1 && items[currentFocus]) {
      competitionInput.value = items[currentFocus].textContent;
      competitionInput.dataset.competitionId = competitions.find(c => c.name_championship === items[currentFocus].textContent)?.id || "";
      closeAutocomplete();
      e.preventDefault();
    }
  }
});

function updateActive(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  if (currentFocus > -1 && items[currentFocus]) {
    items[currentFocus].classList.add("active");
    items[currentFocus].scrollIntoView({block: 'nearest'});
  }
}

// Toast simples para feedback
function showToast(msg, duration = 2500) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// Botão FILTRAR
document.getElementById("filter-btn").addEventListener("click", async function() {
  const selectedId = competitionInput.dataset.competitionId;
  if (selectedId) {
    await showCompetitionSeasons(selectedId);
  } else {
    showToast("Selecione uma competição válida da lista.");
  }
});

// Mostra dados das temporadas da competição selecionada
async function showCompetitionSeasons(id_competition) {
  mainContent.innerHTML = "";
  const comp = competitions.find(c => c.id == id_competition);
  const titulo = document.createElement('h1');
  titulo.className = 'elenco-title';
  titulo.textContent = `Temporadas de ${comp?.name_championship || 'Competição'}`;
  mainContent.appendChild(titulo);

  const seasons = await fetchSeasonsByCompetition(id_competition);
  if (!seasons.length) {
    mainContent.innerHTML += "<div class='elenco-lista-title'>Nenhuma temporada encontrada.</div>";
    return;
  }

  const listaDiv = document.createElement("div");
  listaDiv.className = "elenco-lista";
  seasons.forEach(season => {
    const infoDiv = document.createElement("div");
    infoDiv.style.marginBottom = "24px";
    let tempName = "";
    if (id_competition == 2 || id_competition == 3) {
      tempName = season.name_season_american;
    } else {
      tempName = season.name_season_european;
    }
    infoDiv.innerHTML = `
      <div class="elenco-lista-title">${tempName}</div>
      <ul>
        <li><b>Campeão:</b> ${season.champion_name || "-"}</li>
        <li><b>Vice:</b> ${season.runner_top_name || "-"}</li>
      </ul>
    `;
    listaDiv.appendChild(infoDiv);
  });
  mainContent.appendChild(listaDiv);
}

// SPA / ROTEAMENTO e resto do JS igual
function renderHome() {
  document.getElementById("search-area").style.display = "";
  mainContent.innerHTML = "";
  mainContent.style.animation = "fadein 0.5s";
}

function renderCadastro() {
  // ... igual antes ...
}

function renderLogin() {
  // ... igual antes ...
}

function navigate(path, addToHistory=true) {
  if (path === "/" || path === "") {
    renderHome();
  } else if (path === "/cadastro") {
    renderCadastro();
  } else if (path === "/login") {
    renderLogin();
  }
  if (addToHistory) {
    history.pushState({path}, "", path);
  }
}

function initSPA() {
  if (location.pathname === "/cadastro") {
    renderCadastro();
  } else if (location.pathname === "/login") {
    renderLogin();
  } else {
    renderHome();
  }
  document.getElementById("register-link").addEventListener("click", function(e) {
    e.preventDefault();
    navigate("/cadastro");
  });
  document.querySelector(".btn-login").addEventListener("click", function(e) {
    e.preventDefault();
    navigate("/login");
  });
  document.getElementById("reload-home").addEventListener("click", function() {
    navigate("/");
  });
  window.onpopstate = function(event) {
    if (event.state && event.state.path) {
      if (event.state.path === "/cadastro") renderCadastro();
      else if (event.state.path === "/login") renderLogin();
      else renderHome();
    } else {
      if (location.pathname === "/cadastro") renderCadastro();
      else if (location.pathname === "/login") renderLogin();
      else renderHome();
    }
  };
}
initSPA();