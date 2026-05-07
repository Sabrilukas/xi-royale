const state = {
  balance: 1000000,
  squadCount: 0,
  minimumPlayers: 6,
  maxPlayers: 16,
  totalPoints: 0,
  transferOpen: true,
  selectedFormation: "4-4-2",
  selectedPlayers: [],
  selectedSlot: null,
  activePicker: {
    isOpen: false,
    mode: "pick-lineup",
    slotId: null,
    position: null
  },
  lineupSlots: {},
  benchSlots: {
    "bench-1": null,
    "bench-2": null,
    "bench-3": null,
    "bench-4": null,
    "bench-5": null
  }
};

const formationLayouts = {
  "4-4-2": [
    { id: "442-fwd-1", position: "FWD", left: 38, top: 18 },
    { id: "442-fwd-2", position: "FWD", left: 62, top: 18 },

    { id: "442-mid-1", position: "MID", left: 20, top: 40 },
    { id: "442-mid-2", position: "MID", left: 40, top: 40 },
    { id: "442-mid-3", position: "MID", left: 60, top: 40 },
    { id: "442-mid-4", position: "MID", left: 80, top: 40 },

    { id: "442-def-1", position: "DEF", left: 20, top: 64 },
    { id: "442-def-2", position: "DEF", left: 40, top: 64 },
    { id: "442-def-3", position: "DEF", left: 60, top: 64 },
    { id: "442-def-4", position: "DEF", left: 80, top: 64 },

    { id: "442-gk-1", position: "GK", left: 50, top: 86 }
  ],

  "3-5-2": [
    { id: "352-fwd-1", position: "FWD", left: 38, top: 18 },
    { id: "352-fwd-2", position: "FWD", left: 62, top: 18 },

    { id: "352-mid-1", position: "MID", left: 14, top: 40 },
    { id: "352-mid-2", position: "MID", left: 32, top: 40 },
    { id: "352-mid-3", position: "MID", left: 50, top: 40 },
    { id: "352-mid-4", position: "MID", left: 68, top: 40 },
    { id: "352-mid-5", position: "MID", left: 86, top: 40 },

    { id: "352-def-1", position: "DEF", left: 30, top: 65 },
    { id: "352-def-2", position: "DEF", left: 50, top: 65 },
    { id: "352-def-3", position: "DEF", left: 70, top: 65 },

    { id: "352-gk-1", position: "GK", left: 50, top: 86 }
  ],

  "4-3-3": [
    { id: "433-fwd-1", position: "FWD", left: 24, top: 18 },
    { id: "433-fwd-2", position: "FWD", left: 50, top: 18 },
    { id: "433-fwd-3", position: "FWD", left: 76, top: 18 },

    { id: "433-mid-1", position: "MID", left: 30, top: 42 },
    { id: "433-mid-2", position: "MID", left: 50, top: 42 },
    { id: "433-mid-3", position: "MID", left: 70, top: 42 },

    { id: "433-def-1", position: "DEF", left: 20, top: 66 },
    { id: "433-def-2", position: "DEF", left: 40, top: 66 },
    { id: "433-def-3", position: "DEF", left: 60, top: 66 },
    { id: "433-def-4", position: "DEF", left: 80, top: 66 },

    { id: "433-gk-1", position: "GK", left: 50, top: 86 }
  ]
};

const demoPlayers = [
  { id: 1, name: "Kylian M.", country: "France", price: 91000, rating: 9.1, position: "FWD" },
  { id: 2, name: "Jude B.", country: "England", price: 88000, rating: 8.8, position: "MID" },
  { id: 3, name: "Alisson B.", country: "Brazil", price: 84000, rating: 8.4, position: "GK" },
  { id: 4, name: "Harry K.", country: "England", price: 87000, rating: 8.7, position: "FWD" },
  { id: 5, name: "Vinicius J.", country: "Brazil", price: 90000, rating: 9.0, position: "FWD" },
  { id: 6, name: "Kevin D.", country: "Belgium", price: 86000, rating: 8.6, position: "MID" },
  { id: 7, name: "Luka M.", country: "Croatia", price: 78000, rating: 8.1, position: "MID" },
  { id: 8, name: "Virgil V.", country: "Netherlands", price: 82000, rating: 8.3, position: "DEF" },
  { id: 9, name: "Achraf H.", country: "Morocco", price: 76000, rating: 7.9, position: "DEF" },
  { id: 10, name: "Theo H.", country: "France", price: 79000, rating: 8.0, position: "DEF" },
  { id: 11, name: "Emiliano M.", country: "Argentina", price: 80000, rating: 8.2, position: "GK" },
  { id: 12, name: "Ruben D.", country: "Portugal", price: 81000, rating: 8.2, position: "DEF" },
  { id: 13, name: "Fede V.", country: "Uruguay", price: 79000, rating: 8.1, position: "MID" },
  { id: 14, name: "Pedri G.", country: "Spain", price: 77000, rating: 8.0, position: "MID" }
];

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function calculatePlayerPoints(player) {
  return Math.round(player.rating * 10);
}

function syncSquadStats() {
  state.squadCount = state.selectedPlayers.length;
  state.totalPoints = state.selectedPlayers.reduce((total, playerId) => {
    const player = getPlayer(playerId);
    return player ? total + calculatePlayerPoints(player) : total;
  }, 0);
}

function getPlayer(playerId) {
  return demoPlayers.find((player) => player.id === playerId);
}

function getCurrentLayout() {
  return formationLayouts[state.selectedFormation] || formationLayouts["4-4-2"];
}

function getSlot(slotId) {
  return getCurrentLayout().find((slot) => slot.id === slotId);
}

function getBenchSlot(slotId) {
  if (!Object.prototype.hasOwnProperty.call(state.benchSlots, slotId)) return null;

  return {
    id: slotId,
    label: "BENCH"
  };
}

function isBenchSlot(slotId) {
  return Boolean(getBenchSlot(slotId));
}

function isBenchMode(mode = state.activePicker.mode) {
  return mode.endsWith("-bench");
}

function isManageMode(mode = state.activePicker.mode) {
  return mode.startsWith("manage");
}

function isReplaceMode(mode = state.activePicker.mode) {
  return mode.startsWith("replace");
}

function getSlotPlayerId(slotId) {
  if (isBenchSlot(slotId)) {
    return state.benchSlots[slotId];
  }

  return state.lineupSlots[slotId];
}

function getSelectedLineupPlayerIdsByPosition(position) {
  return Object.values(state.lineupSlots).filter((playerId) => {
    const player = getPlayer(playerId);
    return player && player.position === position;
  });
}

function getAssignedPlayerIds() {
  return [
    ...Object.values(state.lineupSlots),
    ...Object.values(state.benchSlots)
  ].filter(Boolean);
}

function getOpenSlot(position) {
  return getCurrentLayout().find((slot) => {
    return slot.position === position && !state.lineupSlots[slot.id];
  });
}

function getOpenBenchSlot() {
  const slotId = Object.keys(state.benchSlots).find((id) => !state.benchSlots[id]);
  return slotId ? getBenchSlot(slotId) : null;
}

function getFlagClass(player) {
  const flagClasses = {
    France: "flag-france",
    England: "flag-england",
    Brazil: "flag-brazil"
  };

  return flagClasses[player.country] || "";
}

function getFlagMarkup(player) {
  if (player.country === "France") return "<span></span><span></span><span></span>";
  if (player.country === "England") return "<span></span><span></span>";
  if (player.country === "Brazil") return "<span></span>";

  return `<span>${player.position}</span>`;
}

function showFeedback(message) {
  const feedbackElement = document.querySelector("#actionFeedback");
  if (!feedbackElement) return;

  feedbackElement.textContent = message;
  feedbackElement.classList.add("is-active");

  window.setTimeout(() => {
    feedbackElement.classList.remove("is-active");
  }, 2200);
}

function renderStats() {
  syncSquadStats();

  document.querySelector("#balanceValue").textContent = formatMoney(state.balance);
  document.querySelector("#squadCount").textContent = `${state.squadCount} / ${state.maxPlayers}`;
  document.querySelector("#minimumPlayers").textContent = `${state.minimumPlayers} Oyuncu`;
  document.querySelector("#transferStatus").textContent = state.transferOpen ? "Açık" : "Kapalı";
  document.querySelector("#totalPoints").textContent = String(state.totalPoints);
  document.querySelector(".lineup-count").textContent = `${state.squadCount} / ${state.maxPlayers}`;
}

function renderPitch() {
  const pitchSlots = document.querySelector("#pitchSlots");
  if (!pitchSlots) return;

  pitchSlots.innerHTML = "";

  getCurrentLayout().forEach((slotData) => {
    const player = getPlayer(state.lineupSlots[slotData.id]);
    const slot = document.createElement("button");

    slot.className = player ? "player-slot is-filled" : "player-slot";
    slot.type = "button";
    slot.dataset.slotId = slotData.id;
    slot.dataset.position = slotData.position;
    slot.style.left = `${slotData.left}%`;
    slot.style.top = `${slotData.top}%`;

    slot.innerHTML = `
      <span>${slotData.position}</span>
      <strong>${player ? player.name : "+"}</strong>
    `;

    slot.addEventListener("click", () => {
      if (state.lineupSlots[slotData.id]) {
        openSlotManager(slotData.id);
        return;
      }

      openPositionPicker(slotData.id, slotData.position);
    });

    pitchSlots.appendChild(slot);
  });
}

function renderBench() {
  const benchSlots = document.querySelector("#benchSlots");
  const benchCount = document.querySelector("#benchCount");
  if (!benchSlots || !benchCount) return;

  const filledBenchSlots = Object.values(state.benchSlots).filter(Boolean).length;
  benchCount.textContent = `${filledBenchSlots} / 5`;
  benchSlots.innerHTML = "";

  Object.keys(state.benchSlots).forEach((slotId) => {
    const player = getPlayer(state.benchSlots[slotId]);
    const slot = document.createElement("button");

    slot.className = player ? "bench-slot is-filled" : "bench-slot";
    slot.type = "button";
    slot.dataset.slotId = slotId;

    slot.innerHTML = `
      <span>BENCH</span>
      <strong>${player ? player.name : "+"}</strong>
    `;

    slot.addEventListener("click", () => {
      if (player) {
        openSlotManager(slotId);
        return;
      }

      openBenchPicker(slotId);
    });

    benchSlots.appendChild(slot);
  });
}

function moveLineupOverflowToBenchOrRefund(playerIds) {
  const moved = [];
  const refunded = [];

  playerIds.forEach((playerId) => {
    const player = getPlayer(playerId);
    if (!player) return;

    const openBenchSlot = getOpenBenchSlot();

    if (openBenchSlot) {
      state.benchSlots[openBenchSlot.id] = player.id;
      moved.push(player);
      return;
    }

    state.selectedPlayers = state.selectedPlayers.filter((selectedId) => selectedId !== player.id);
    state.balance += player.price;
    refunded.push(player);
  });

  return { moved, refunded };
}

function rebuildLineupSlots() {
  const nextLineupSlots = {};
  const overflowPlayerIds = [];
  const positions = ["FWD", "MID", "DEF", "GK"];

  positions.forEach((position) => {
    const positionSlots = getCurrentLayout().filter((slot) => slot.position === position);
    const selectedPlayerIds = getSelectedLineupPlayerIdsByPosition(position);

    positionSlots.forEach((slot, index) => {
      const playerId = selectedPlayerIds[index];

      if (playerId) {
        nextLineupSlots[slot.id] = playerId;
      }
    });

    if (selectedPlayerIds.length > positionSlots.length) {
      overflowPlayerIds.push(...selectedPlayerIds.slice(positionSlots.length));
    }
  });

  state.lineupSlots = nextLineupSlots;
  const result = moveLineupOverflowToBenchOrRefund(overflowPlayerIds);
  closePositionPicker({ render: false });

  return result;
}

function assignPlayerToLineupSlot(player, slotId) {
  const slot = getSlot(slotId);

  if (!slot) {
    showFeedback("Bu slot artık mevcut formasyonda yok.");
    return false;
  }

  if (slot.position !== player.position) {
    showFeedback(`${slot.position} slotuna sadece ${slot.position} oyuncusu seçilebilir.`);
    return false;
  }

  if (state.lineupSlots[slot.id]) {
    showFeedback("Bu slot dolu. Başka bir boş slot seç.");
    return false;
  }

  state.lineupSlots = {
    ...state.lineupSlots,
    [slot.id]: player.id
  };

  return true;
}

function assignPlayerToBenchSlot(player, slotId) {
  const slot = getBenchSlot(slotId);

  if (!slot) {
    showFeedback("Geçerli bir bench slotu seç.");
    return false;
  }

  if (state.benchSlots[slot.id]) {
    showFeedback("Bu bench slotu dolu. Başka bir boş slot seç.");
    return false;
  }

  state.benchSlots = {
    ...state.benchSlots,
    [slot.id]: player.id
  };

  return true;
}

function assignPlayerToAnyOpenSlot(player) {
  const lineupSlot = getOpenSlot(player.position);

  if (lineupSlot) {
    return assignPlayerToLineupSlot(player, lineupSlot.id);
  }

  const benchSlot = getOpenBenchSlot();

  if (benchSlot) {
    return assignPlayerToBenchSlot(player, benchSlot.id);
  }

  showFeedback("Kadroda boş slot yok.");
  return false;
}

function buyPlayer(playerId, options = {}) {
  const player = getPlayer(playerId);
  if (!player) return;

  if (!state.transferOpen) {
    showFeedback("Transfer dönemi kapalı.");
    return;
  }

  if (state.selectedPlayers.includes(player.id)) {
    showFeedback(`${player.name} zaten kadroda.`);
    return;
  }

  if (state.selectedPlayers.length >= state.maxPlayers) {
    showFeedback("Kadro limiti dolu.");
    return;
  }

  if (state.balance < player.price) {
    showFeedback("Bakiye yetersiz.");
    return;
  }

  const placed = options.slotId
    ? isBenchSlot(options.slotId)
      ? assignPlayerToBenchSlot(player, options.slotId)
      : assignPlayerToLineupSlot(player, options.slotId)
    : assignPlayerToAnyOpenSlot(player);

  if (!placed) return;

  state.balance -= player.price;
  state.selectedPlayers = state.selectedPlayers.concat(player.id);

  closePositionPicker({ render: false });
  renderAll();
  showFeedback(`${player.name} kadroya eklendi. Bakiye güncellendi.`);
}

function removePlayerFromAnySlot(slotId) {
  const playerId = getSlotPlayerId(slotId);
  const player = getPlayer(playerId);

  if (!player) {
    showFeedback("Bu slot zaten boş.");
    closePositionPicker();
    return;
  }

  if (isBenchSlot(slotId)) {
    state.benchSlots = {
      ...state.benchSlots,
      [slotId]: null
    };
  } else {
    const nextLineupSlots = { ...state.lineupSlots };
    delete nextLineupSlots[slotId];
    state.lineupSlots = nextLineupSlots;
  }

  state.selectedPlayers = state.selectedPlayers.filter((selectedId) => selectedId !== player.id);
  state.balance += player.price;

  closePositionPicker({ render: false });
  renderAll();
  showFeedback(`${player.name} kadrodan çıkarıldı. Bakiye güncellendi.`);
}

function replacePlayerInAnySlot(newPlayerId, slotId) {
  const oldPlayerId = getSlotPlayerId(slotId);
  const oldPlayer = getPlayer(oldPlayerId);
  const newPlayer = getPlayer(newPlayerId);
  const lineupSlot = getSlot(slotId);
  const benchSlot = getBenchSlot(slotId);

  if (!oldPlayer || !newPlayer || (!lineupSlot && !benchSlot)) {
    showFeedback("Değişim için geçerli bir slot seç.");
    return;
  }

  if (lineupSlot && newPlayer.position !== lineupSlot.position) {
    showFeedback(`${lineupSlot.position} slotuna sadece ${lineupSlot.position} oyuncusu seçilebilir.`);
    return;
  }

  if (newPlayer.id === oldPlayer.id) {
    showFeedback(`${newPlayer.name} zaten bu slotta.`);
    return;
  }

  if (state.selectedPlayers.includes(newPlayer.id)) {
    showFeedback(`${newPlayer.name} zaten kadroda.`);
    return;
  }

  const priceDifference = newPlayer.price - oldPlayer.price;

  if (priceDifference > state.balance) {
    showFeedback(`Bakiye yetersiz. Değişim için ${formatMoney(priceDifference)} gerekli.`);
    return;
  }

  if (benchSlot) {
    state.benchSlots = {
      ...state.benchSlots,
      [slotId]: newPlayer.id
    };
  } else {
    state.lineupSlots = {
      ...state.lineupSlots,
      [slotId]: newPlayer.id
    };
  }

  state.selectedPlayers = state.selectedPlayers
    .filter((playerId) => playerId !== oldPlayer.id)
    .concat(newPlayer.id);
  state.balance -= priceDifference;

  closePositionPicker({ render: false });
  renderAll();
  showFeedback(`${oldPlayer.name} yerine ${newPlayer.name} seçildi. Bakiye güncellendi.`);
}

function renderMarketButtons() {
  document.querySelectorAll(".market-panel .player-price button").forEach((button, index) => {
    const player = demoPlayers[index];
    const isSelected = player && state.selectedPlayers.includes(player.id);
    const playerCard = button.closest(".player-card");

    if (!player) return;

    button.textContent = isSelected ? "Alındı" : "Al";
    button.disabled = isSelected;

    if (playerCard) {
      playerCard.classList.toggle("is-owned", isSelected);
    }
  });
}

function createPickerPlayerCard(player) {
  const currentPlayerId = getSlotPlayerId(state.activePicker.slotId);
  const isCurrent = isReplaceMode() && player.id === currentPlayerId;
  const isSelected = state.selectedPlayers.includes(player.id);
  const card = document.createElement("article");
  const price = Math.round(player.price / 1000);
  const flagClass = getFlagClass(player);
  const buttonLabel = isCurrent ? "Mevcut" : isSelected ? "Alındı" : "Al";

  card.className = "player-card";

  if (isSelected) {
    card.classList.add("is-owned");
  }

  if (isCurrent) {
    card.classList.add("is-current");
  }

  card.innerHTML = `
    <div class="player-flag ${flagClass}" aria-hidden="true">${getFlagMarkup(player)}</div>
    <div class="player-info">
      <strong>${player.name}</strong>
      <span>${player.country} • ${player.position} • Rating ${player.rating}</span>
    </div>
    <div class="player-price">
      <strong>$${price}K</strong>
      <button type="button">${buttonLabel}</button>
    </div>
  `;

  const button = card.querySelector("button");
  button.disabled = isSelected;
  button.addEventListener("click", () => {
    if (isReplaceMode()) {
      replacePlayerInAnySlot(player.id, state.activePicker.slotId);
      return;
    }

    buyPlayer(player.id, { slotId: state.activePicker.slotId });
  });

  return card;
}

function renderPlayerPicker() {
  const pickerTitle = document.querySelector("#pickerTitle");
  const pickerModeLabel = document.querySelector("#pickerModeLabel");
  const pickerPosition = document.querySelector("#pickerPosition");
  const pickerBalance = document.querySelector("#pickerBalance");
  const pickerNote = document.querySelector("#pickerNote");
  const pickerList = document.querySelector("#pickerList");

  if (!pickerTitle || !pickerModeLabel || !pickerPosition || !pickerBalance || !pickerNote || !pickerList) return;

  const benchMode = isBenchMode();
  const replaceMode = isReplaceMode();
  const position = state.activePicker.position;
  const players = benchMode
    ? demoPlayers
    : demoPlayers.filter((player) => player.position === position);

  pickerModeLabel.textContent = benchMode ? "Bench Pick" : "Position Pick";
  pickerTitle.textContent = benchMode ? "Yedek Oyuncu Seç" : `${position} Oyuncu Seç`;
  pickerPosition.textContent = benchMode ? "Slot: BENCH" : `Slot: ${position}`;
  pickerBalance.textContent = `Bakiye: ${formatMoney(state.balance)}`;
  pickerNote.textContent = replaceMode
    ? "Mevcut oyuncu hariç tekrar seçim yok"
    : "Tekrar seçim yapılamaz";

  pickerList.classList.remove("is-management");
  pickerList.innerHTML = "";

  players.forEach((player) => {
    pickerList.appendChild(createPickerPlayerCard(player));
  });
}

function renderSlotManager() {
  const pickerTitle = document.querySelector("#pickerTitle");
  const pickerModeLabel = document.querySelector("#pickerModeLabel");
  const pickerPosition = document.querySelector("#pickerPosition");
  const pickerBalance = document.querySelector("#pickerBalance");
  const pickerNote = document.querySelector("#pickerNote");
  const pickerList = document.querySelector("#pickerList");
  const lineupSlot = getSlot(state.activePicker.slotId);
  const benchSlot = getBenchSlot(state.activePicker.slotId);
  const player = getPlayer(getSlotPlayerId(state.activePicker.slotId));

  if (!pickerTitle || !pickerModeLabel || !pickerPosition || !pickerBalance || !pickerNote || !pickerList) return;

  if (!player || (!lineupSlot && !benchSlot)) {
    closePositionPicker();
    return;
  }

  const slotLabel = benchSlot ? "BENCH" : lineupSlot.position;

  pickerModeLabel.textContent = "Slot Management";
  pickerTitle.textContent = player.name;
  pickerPosition.textContent = `Slot: ${slotLabel}`;
  pickerBalance.textContent = `Bakiye: ${formatMoney(state.balance)}`;
  pickerNote.textContent = `Puan: ${calculatePlayerPoints(player)}`;

  pickerList.classList.add("is-management");
  pickerList.innerHTML = `
    <article class="slot-manager-card">
      <p class="slot-manager-name">${player.name}</p>

      <div class="slot-manager-grid">
        <div class="slot-manager-stat">
          <span>Pozisyon</span>
          <strong>${player.position}</strong>
        </div>
        <div class="slot-manager-stat">
          <span>Ülke</span>
          <strong>${player.country}</strong>
        </div>
        <div class="slot-manager-stat">
          <span>Rating</span>
          <strong>${player.rating}</strong>
        </div>
        <div class="slot-manager-stat">
          <span>Fiyat</span>
          <strong>${formatMoney(player.price)}</strong>
        </div>
        <div class="slot-manager-stat">
          <span>Kadro Puanı</span>
          <strong>${calculatePlayerPoints(player)}</strong>
        </div>
        <div class="slot-manager-stat">
          <span>Mevcut Bakiye</span>
          <strong>${formatMoney(state.balance)}</strong>
        </div>
      </div>
    </article>

    <div class="slot-manager-actions">
      <button class="slot-action-button is-primary" type="button" data-slot-action="replace">
        Oyuncuyu Değiştir
      </button>
      <button class="slot-action-button is-danger" type="button" data-slot-action="remove">
        Oyuncuyu Kaldır
      </button>
      <button class="slot-action-button is-neutral" type="button" data-slot-action="close">
        Kapat
      </button>
    </div>
  `;

  pickerList.querySelector('[data-slot-action="replace"]').addEventListener("click", () => {
    if (benchSlot) {
      openBenchPicker(benchSlot.id, "replace-bench");
      return;
    }

    openPositionPicker(lineupSlot.id, lineupSlot.position, "replace-lineup");
  });

  pickerList.querySelector('[data-slot-action="remove"]').addEventListener("click", () => {
    removePlayerFromAnySlot(state.activePicker.slotId);
  });

  pickerList.querySelector('[data-slot-action="close"]').addEventListener("click", () => {
    closePositionPicker();
  });
}

function renderPickerModal() {
  const modal = document.querySelector("#pickerModal");
  const pickerList = document.querySelector("#pickerList");
  const isOpen = state.activePicker.isOpen && state.activePicker.slotId;

  if (!modal || !pickerList) return;

  modal.classList.toggle("is-open", Boolean(isOpen));
  modal.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("modal-open", Boolean(isOpen));

  if (!isOpen) {
    pickerList.classList.remove("is-management");
    pickerList.innerHTML = "";
    return;
  }

  if (isManageMode()) {
    renderSlotManager();
    return;
  }

  renderPlayerPicker();
}

function focusPickerCloseButton() {
  window.requestAnimationFrame(() => {
    const closeButton = document.querySelector("#closePickerButton");

    if (closeButton && state.activePicker.isOpen) {
      closeButton.focus();
    }
  });
}

function openPositionPicker(slotId, position, mode = "pick-lineup") {
  state.selectedSlot = {
    id: slotId,
    position
  };

  state.activePicker = {
    isOpen: true,
    mode,
    slotId,
    position
  };

  renderPickerModal();
  focusPickerCloseButton();
  showFeedback(`${position} için uygun oyuncular listelendi.`);
}

function openBenchPicker(slotId, mode = "pick-bench") {
  if (!getBenchSlot(slotId)) return;

  state.selectedSlot = {
    id: slotId,
    position: null
  };

  state.activePicker = {
    isOpen: true,
    mode,
    slotId,
    position: null
  };

  renderPickerModal();
  focusPickerCloseButton();
  showFeedback("Yedek slot için tüm oyuncular listelendi.");
}

function openSlotManager(slotId) {
  const lineupSlot = getSlot(slotId);
  const benchSlot = getBenchSlot(slotId);
  const player = getPlayer(getSlotPlayerId(slotId));

  if (!lineupSlot && !benchSlot) return;

  if (!player) {
    if (benchSlot) {
      openBenchPicker(benchSlot.id);
      return;
    }

    openPositionPicker(lineupSlot.id, lineupSlot.position);
    return;
  }

  state.selectedSlot = {
    id: slotId,
    position: lineupSlot ? lineupSlot.position : null
  };

  state.activePicker = {
    isOpen: true,
    mode: benchSlot ? "manage-bench" : "manage-lineup",
    slotId,
    position: lineupSlot ? lineupSlot.position : null
  };

  renderPickerModal();
  focusPickerCloseButton();
  showFeedback(`${player.name} için slot yönetimi açıldı.`);
}

function closePositionPicker(options = {}) {
  const shouldRender = options.render !== false;

  state.selectedSlot = null;
  state.activePicker = {
    isOpen: false,
    mode: "pick-lineup",
    slotId: null,
    position: null
  };

  if (shouldRender) {
    renderPickerModal();
  }
}

function renderAll() {
  renderStats();
  renderPitch();
  renderBench();
  renderMarketButtons();
  renderPickerModal();
}

function bindBuyButtons() {
  document.querySelectorAll(".market-panel .player-price button").forEach((button, index) => {
    const player = demoPlayers[index];

    if (!player) return;

    button.addEventListener("click", () => {
      buyPlayer(player.id);
    });
  });
}

function bindFormationButtons() {
  document.querySelectorAll(".formation-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const nextFormation = button.dataset.formation;

      if (!formationLayouts[nextFormation]) return;

      document.querySelectorAll(".formation-chip").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      state.selectedFormation = nextFormation;

      const result = rebuildLineupSlots();
      renderAll();

      if (result.refunded.length) {
        const names = result.refunded.map((player) => player.name).join(", ");
        showFeedback(`${names} için bench dolu olduğu için bakiye iade edildi.`);
        return;
      }

      if (result.moved.length) {
        const names = result.moved.map((player) => player.name).join(", ");
        showFeedback(`${names} yeni formasyonda bench'e taşındı.`);
        return;
      }

      showFeedback(`${state.selectedFormation} formasyonu seçildi.`);
    });
  });
}

function bindHeroButton() {
  document.querySelector("#buildTeamButton").addEventListener("click", () => {
    document.querySelector("#lineupPanel").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    showFeedback("Line-up bölümüne yönlendirildin.");
  });
}

function bindPickerControls() {
  const closeButton = document.querySelector("#closePickerButton");
  const backdrop = document.querySelector("[data-close-picker]");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closePositionPicker();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      closePositionPicker();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.activePicker.isOpen) {
      closePositionPicker();
    }
  });
}

function bindNavButtons() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      showFeedback(`${button.textContent.trim()} sekmesi seçildi.`);
    });
  });
}

function init() {
  rebuildLineupSlots();
  renderAll();
  bindHeroButton();
  bindFormationButtons();
  bindBuyButtons();
  bindPickerControls();
  bindNavButtons();
}

document.addEventListener("DOMContentLoaded", init);
