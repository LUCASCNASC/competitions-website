// Por enquanto, não há scripts necessários. 
// Você pode adicionar funcionalidades JavaScript aqui no futuro.

// ====== CLEAR BUTTON EM CAMPOS DE PESQUISA DE COMPETIÇÕES ======

// Função para adicionar clear button ao campo de pesquisa de competições
function setupCompetitionSearchClear() {
  // Suporte tanto para class quanto para id usado no campo de busca
  const input = document.querySelector('.search-input') || document.getElementById('competitionInput');
  if (!input) return;

  // Cria o botão clear (x)
  let clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.innerHTML = '&times;';
  clearBtn.className = 'input-clear-btn';
  clearBtn.setAttribute('aria-label', 'Limpar pesquisa');

  // Adiciona o botão na mesma div.parent do input
  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(clearBtn);

  // Mostra ou esconde o botão, conforme o input tem valor ou não
  function toggleBtn() {
    if (input.value.length > 0) {
      clearBtn.classList.add('show');
    } else {
      clearBtn.classList.remove('show');
    }
  }
  input.addEventListener('input', toggleBtn);
  input.addEventListener('focus', toggleBtn);
  input.addEventListener('blur', () => {
    // Esconde o botão após blur se input estiver vazio
    setTimeout(() => {
      if (!input.value) clearBtn.classList.remove('show');
    }, 100);
  });

  // Ao clicar no X, limpa o input e dispara evento (útil para autocomplete)
  clearBtn.addEventListener('mousedown', function (e) {
    e.preventDefault();
    input.value = '';
    clearBtn.classList.remove('show');
    input.focus();
    // Dispara evento input para atualizar autocomplete ou outros listeners
    const evt = new Event('input', { bubbles: true });
    input.dispatchEvent(evt);
  });
}

// Executa ao carregar a página
window.addEventListener('DOMContentLoaded', setupCompetitionSearchClear);