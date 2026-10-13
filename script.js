// VOYAGO — interações do site
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3400);
  }

  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Filtros por categoria
  const filterButtons = document.querySelectorAll(".filter-chip");
  const cards = [...document.querySelectorAll(".destination-card")];
  const noResults = document.getElementById("noResults");
  let activeFilter = "todos";

  function filterDestinations(searchText = "") {
    const term = searchText.trim().toLocaleLowerCase("pt-BR");
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeFilter === "todos" || card.dataset.category === activeFilter;
      const haystack = (card.dataset.search + " " + card.innerText).toLocaleLowerCase("pt-BR");
      const matchesSearch = !term || haystack.includes(term);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    noResults.hidden = visible !== 0;
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      filterDestinations(document.getElementById("destinationInput").value);
    });
  });

  // Busca simples local: filtra os destinos que já aparecem no catálogo.
  document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    const destination = document.getElementById("destinationInput").value;
    const date = document.getElementById("dateInput").value;
    const travelers = document.getElementById("travelersInput").value;
    filterDestinations(destination);
    document.getElementById("destinos").scrollIntoView({ behavior: "smooth" });
    const count = cards.filter(card => !card.hidden).length;
    if (destination.trim()) {
      showToast(count ? `${count} destino(s) encontrado(s) para sua busca.` : "Não encontramos esse destino no catálogo. Experimente Bali, Lisboa, Kyoto ou Grécia.");
    } else {
      showToast(`Vamos planejar sua viagem para ${travelers} viajante(s)${date ? " a partir de " + new Date(date + "T12:00:00").toLocaleDateString("pt-BR") : ""}. Escolha um destino abaixo.`);
    }
  });

  // Favoritos demonstrativos
  document.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", () => {
      const active = button.classList.toggle("is-favorite");
      button.setAttribute("aria-pressed", String(active));
      showToast(active ? "Destino adicionado aos favoritos desta sessão." : "Destino removido dos favoritos.");
    });
  });

  // Formulário de newsletter demonstrativo: não envia dados a um servidor.
  document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("emailInput");
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }
    showToast("Obrigado! O formulário está funcionando visualmente, mas precisa de integração para cadastrar e-mails.");
    email.value = "";
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Impede selecionar datas passadas.
  const dateInput = document.getElementById("dateInput");
  const today = new Date();
  dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
});
