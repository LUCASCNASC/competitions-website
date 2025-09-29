
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

// NOVO: Formulário de cadastro funcional e bonito com preview, validação e feedback
function renderCadastro() {
  mainContent.innerHTML = `
    <div class="cadastro-container">
      <h1>CADASTRE-SE</h1>
      <form class="cadastro-form" id="cadastro-form" enctype="multipart/form-data" autocomplete="off" novalidate>
        <div class="form-row">
          <div>
            <label for="nome_completo">Nome completo*</label>
            <input name="nome_completo" id="nome_completo" required autocomplete="name" />
            <span class="field-erro" id="erro-nome_completo"></span>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="data_nascimento">Data de nascimento*</label>
            <input name="data_nascimento" id="data_nascimento" type="date" required autocomplete="bday" />
            <span class="field-erro" id="erro-data_nascimento"></span>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="email">E-mail*</label>
            <input name="email" id="email" type="email" required autocomplete="email" />
            <span class="field-erro" id="erro-email"></span>
          </div>
          <div>
            <label for="confirmar_email">Confirmar e-mail*</label>
            <input name="confirmar_email" id="confirmar_email" type="email" required />
            <span class="field-erro" id="erro-confirmar_email"></span>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="genero">Gênero*</label>
            <select name="genero" id="genero" required>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
            <span class="field-erro" id="erro-genero"></span>
          </div>
          <div>
            <label for="apelido">Apelido</label>
            <input name="apelido" id="apelido" autocomplete="nickname"/>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="foto">Foto</label>
            <input name="foto" id="foto" type="file" accept="image/*" />
            <div id="foto-preview" class="foto-preview" style="display:none;"></div>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="cidade">Cidade*</label>
            <input name="cidade" id="cidade" required autocomplete="address-level2"/>
            <span class="field-erro" id="erro-cidade"></span>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label for="senha">Senha*</label>
            <input name="senha" id="senha" type="password" required autocomplete="new-password" />
            <span class="field-erro" id="erro-senha"></span>
          </div>
          <div>
            <label for="confirmar_senha">Confirmar senha*</label>
            <input name="confirmar_senha" id="confirmar_senha" type="password" required />
            <span class="field-erro" id="erro-confirmar_senha"></span>
          </div>
        </div>
        <div id="cadastro-erro" class="erro"></div>
        <div id="cadastro-sucesso" class="sucesso"></div>
        <button type="submit" class="btn-cadastrar">Cadastrar</button>
      </form>
    </div>
  `;

  // Preview da foto
  document.getElementById("foto").addEventListener("change", function(e) {
    const previewDiv = document.getElementById("foto-preview");
    previewDiv.style.display = "none";
    previewDiv.innerHTML = "";
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        previewDiv.innerHTML = `<img src="${ev.target.result}" alt="Preview da foto" style="max-width:120px;max-height:120px;border-radius:6px;">`;
        previewDiv.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Validação em tempo real
  const fields = [
    "nome_completo", "data_nascimento", "email", "confirmar_email",
    "genero", "cidade", "senha", "confirmar_senha"
  ];
  fields.forEach(field => {
    document.getElementById(field).addEventListener("input", function() {
      validateField(field);
    });
  });
  document.getElementById("confirmar_email").addEventListener("input", function() {
    validateEmails();
  });
  document.getElementById("confirmar_senha").addEventListener("input", function() {
    validateSenhas();
  });

  function validateField(field) {
    const val = document.getElementById(field).value.trim();
    const erroSpan = document.getElementById("erro-" + field);
    erroSpan.textContent = "";
    if (!val) {
      erroSpan.textContent = "Obrigatório";
    }
    if (field === "email" && val) {
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(val)) erroSpan.textContent = "Email inválido";
    }
  }
  function validateEmails() {
    const email = document.getElementById("email").value.trim();
    const confEmail = document.getElementById("confirmar_email").value.trim();
    const erroSpan = document.getElementById("erro-confirmar_email");
    erroSpan.textContent = "";
    if (email && confEmail && email !== confEmail) {
      erroSpan.textContent = "Emails não coincidem";
    }
  }
  function validateSenhas() {
    const senha = document.getElementById("senha").value;
    const confSenha = document.getElementById("confirmar_senha").value;
    const erroSpan = document.getElementById("erro-confirmar_senha");
    erroSpan.textContent = "";
    if (senha && confSenha && senha !== confSenha) {
      erroSpan.textContent = "Senhas não coincidem";
    }
  }

  document.getElementById("cadastro-form").onsubmit = async function(e) {
    e.preventDefault();
    const erroDiv = document.getElementById("cadastro-erro");
    const sucessoDiv = document.getElementById("cadastro-sucesso");
    erroDiv.textContent = "";
    sucessoDiv.textContent = "";

    // Validação final
    let erro = false;
    fields.forEach(field => {
      validateField(field);
      if (document.getElementById("erro-" + field).textContent) erro = true;
    });
    validateEmails();
    validateSenhas();
    if (document.getElementById("erro-confirmar_email").textContent) erro = true;
    if (document.getElementById("erro-confirmar_senha").textContent) erro = true;
    if (erro) {
      erroDiv.textContent = "Corrija os campos destacados!";
      return;
    }

    const form = new FormData(this);

    try {
      const response = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (response.ok) {
        sucessoDiv.textContent = "Usuário cadastrado com sucesso!";
        setTimeout(() => {
          navigate("/", true);
        }, 2000);
      } else {
        erroDiv.textContent = data.error || "Erro ao cadastrar.";
      }
    } catch {
      erroDiv.textContent = "Erro ao conectar com o servidor.";
    }
  };
}

function renderLogin() {
  mainContent.innerHTML = `
    <div class="cadastro-container">
      <h1>LOGIN (simulação)</h1>
      <div class="form-row"><div>Funcionalidade não implementada aqui.</div></div>
    </div>
  `;
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