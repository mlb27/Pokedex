let mainRef;
let cardRef;
let cardStatRef;

let responseAsJson;
let pokemonAsJson;

let pName;
let pId;
let pImg;
let pType;

let currentOffset = 0;
let loadedPokemonData = [];
let extendedLoadedPokemon = [];
let typeNameCache = {};
const BASE_URL = "https://pokeapi.co/api/v2/";
const PAGE_SIZE = 40;
const GERMAN_LANGUAGE = "de";
const POKEMON_STORAGE_KEY = "loadedPokemonData";
const EXTENDED_STORAGE_KEY = "extendedLoadedPokemon";
const OFFSET_STORAGE_KEY = "currentOffset";

async function init() {
    setupEventListeners();
    await initStoredData();
    await initPokemonData();
}

function setupEventListeners() {
    let infoDialog = document.getElementById("info");
    let loadingDialog = document.getElementById("loading");
    let clearConfirmDialog = document.getElementById("clearConfirmDialog");
    let mobileSearchDialog = document.getElementById("mobileSearchDialog");
    infoDialog.addEventListener("click", closeDialogOnBackdropClick);
    infoDialog.addEventListener("close", unlockBackgroundScroll);
    loadingDialog.addEventListener("close", unlockBackgroundScroll);
    clearConfirmDialog.addEventListener("click", closeClearConfirmDialogOnBackdrop);
    clearConfirmDialog.addEventListener("close", unlockBackgroundScroll);
    mobileSearchDialog.addEventListener("click", closeMobileSearchOnBackdrop);
    mobileSearchDialog.addEventListener("close", unlockBackgroundScroll);
    window.addEventListener("keydown", changePokemonOnKeydown);
    window.addEventListener("keydown", closeMobileSearchOnEscape);
}

async function initPokemonData() {
    if (loadedPokemonData.length === 0) {
        await loadData();
        return;
    }
    await localizeLoadedPokemonData();
    renderStoredPokemon();
    await waitForBrowserRender();
    closeLoadingDialog();
}

async function initStoredData() {
    openLoadingDialog();
    await waitForBrowserRender();
    getFromLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem(POKEMON_STORAGE_KEY, JSON.stringify(loadedPokemonData));
    localStorage.setItem(EXTENDED_STORAGE_KEY, JSON.stringify(extendedLoadedPokemon));
    localStorage.setItem(OFFSET_STORAGE_KEY, JSON.stringify(currentOffset));
    updateLoadedPokemonTag();
}

function getFromLocalStorage() {
    loadedPokemonData = getArrayFromStorage(POKEMON_STORAGE_KEY);
    extendedLoadedPokemon = getArrayFromStorage(EXTENDED_STORAGE_KEY);
    currentOffset = getOffsetFromStorage();
    resetOffsetWithoutPokemon();
    updateLoadedPokemonTag();
}

function resetOffsetWithoutPokemon() {
    if (loadedPokemonData.length === 0) {
        currentOffset = 0;
    }
}

function getArrayFromStorage(key) {
    let storedData = JSON.parse(localStorage.getItem(key));

    if (storedData === null) {
        return [];
    }
    return storedData;
}

function getOffsetFromStorage() {
    let savedOffset = JSON.parse(localStorage.getItem(OFFSET_STORAGE_KEY));

    if (savedOffset !== null) {
        return savedOffset;
    }
    return getOffsetFromLoaded();
}

function getOffsetFromLoaded() {
    let offset = 0;

    while (findLoadedPokemon(offset + 1)) {
        offset++;
    }
    return offset;
}

async function clearStoredData() {
    openLoadingDialog();
    await waitForBrowserRender();
    resetPokemonData();
    clearPokemonStorage();
    clearSearchInput();
    renderStoredPokemon();
    await waitForBrowserRender();
    closeLoadingDialog();
}

function openClearConfirmDialog() {
    let clearConfirmDialog = document.getElementById("clearConfirmDialog");

    if (!clearConfirmDialog.open) {
        openDialog(clearConfirmDialog);
    }
}

function closeClearConfirmDialog() {
    let clearConfirmDialog = document.getElementById("clearConfirmDialog");

    if (clearConfirmDialog.open) {
        clearConfirmDialog.close();
    }
}

async function confirmClearStoredData() {
    closeClearConfirmDialog();
    await waitForBrowserRender();
    await clearStoredData();
}

function closeClearConfirmDialogOnBackdrop(event) {
    if (isClickOutsideDialog(event)) {
        closeClearConfirmDialog();
    }
}

function isClickOutsideDialog(event) {
    let dialogDimensions = event.currentTarget.getBoundingClientRect();

    return (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
    );
}

function resetPokemonData() {
    loadedPokemonData = [];
    extendedLoadedPokemon = [];
    currentOffset = 0;
}

function clearPokemonStorage() {
    localStorage.removeItem(POKEMON_STORAGE_KEY);
    localStorage.removeItem(EXTENDED_STORAGE_KEY);
    localStorage.removeItem(OFFSET_STORAGE_KEY);
    updateLoadedPokemonTag();
}

function updateLoadedPokemonTag() {
    let loadedPokemonTag = document.getElementById("loadedPokemonTag");

    if (!loadedPokemonTag) {
        return;
    }
    loadedPokemonTag.innerText = `${loadedPokemonData.length} Pokemon geladen und gespeichert`;
}

function clearSearchInput() {
    setSearchInputValue("");
}

async function loadData() {
    openLoadingDialog();
    await waitForBrowserRender();
    try {
        await loadAndRenderData();
    } finally {
        closeLoadingDialog();
    }
}

async function loadAndRenderData() {
    let response = await fetch(`${BASE_URL}pokemon?limit=${PAGE_SIZE}&offset=${currentOffset}`);
    responseAsJson = await response.json();

    await getPokemonData();
    currentOffset += PAGE_SIZE;
    saveToLocalStorage();
    renderStoredPokemon();
}

async function getPokemonData() {
    await fetchPokemonPage();
}

async function fetchPokemonPage() {
    for (let i = 0; i < responseAsJson.results.length; i++) {
        await addPokemonFromUrl(responseAsJson.results[i].url);
    }
}

async function addPokemonFromUrl(url) {
    let pokemon = await fetch(url);
    pokemonAsJson = await pokemon.json();
    await addLoadedPokemon(pokemonAsJson);
}

async function addLoadedPokemon(pokemonData) {
    let storedPokemon = findLoadedPokemon(pokemonData.id);

    if (storedPokemon) {
        if (await localizePokemonData(storedPokemon)) {
            saveToLocalStorage();
        }
        return storedPokemon;
    }
    let normalizedPokemon = normalizePokemonData(pokemonData);
    await localizePokemonData(normalizedPokemon);
    loadedPokemonData.push(normalizedPokemon);
    sortLoadedPokemon();
    return normalizedPokemon;
}

function normalizePokemonData(pokemonData) {
    let officialImg = pokemonData.sprites.other["official-artwork"].front_default;

    return {
        id: pokemonData.id,
        name: pokemonData.name,
        germanName: pokemonData.germanName,
        sprites: { other: { "official-artwork": { front_default: officialImg } } },
        types: pokemonData.types,
        stats: pokemonData.stats,
        species: pokemonData.species,
    };
}

async function localizeLoadedPokemonData() {
    let hasChanges = false;

    for (let i = 0; i < loadedPokemonData.length; i++) {
        hasChanges = (await localizePokemonData(loadedPokemonData[i])) || hasChanges;
    }
    if (hasChanges) {
        saveToLocalStorage();
    }
}

async function localizePokemonData(pokemonData) {
    let hasGermanNameChanged = await localizePokemonName(pokemonData);
    let hasGermanTypesChanged = await localizePokemonTypes(pokemonData);

    return hasGermanNameChanged || hasGermanTypesChanged;
}

async function localizePokemonName(pokemonData) {
    if (pokemonData.germanName) {
        return false;
    }
    let speciesData = await getOrFetchSpecies(pokemonData);

    if (!speciesData || !speciesData.germanName) {
        return false;
    }
    pokemonData.germanName = speciesData.germanName;
    return true;
}

async function localizePokemonTypes(pokemonData) {
    let hasChanges = false;

    for (let i = 0; i < pokemonData.types.length; i++) {
        hasChanges = (await localizePokemonType(pokemonData.types[i].type)) || hasChanges;
    }
    return hasChanges;
}

async function localizePokemonType(typeData) {
    if (typeData.germanName) {
        typeNameCache[typeData.name] = typeData.germanName;
        return false;
    }
    let germanName = await getGermanTypeName(typeData);

    if (!germanName) {
        return false;
    }
    typeData.germanName = germanName;
    return true;
}

async function getGermanTypeName(typeData) {
    if (typeNameCache[typeData.name]) {
        return typeNameCache[typeData.name];
    }
    let typeDetails = await fetchTypeDetails(typeData);

    if (!typeDetails) {
        return null;
    }
    let germanName = getLocalizedName(typeDetails.names, null);

    typeNameCache[typeData.name] = germanName;
    return germanName;
}

async function fetchTypeDetails(typeData) {
    let typeUrl = typeData.url || `${BASE_URL}type/${typeData.name}`;

    try {
        let response = await fetch(typeUrl);

        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

function getLocalizedName(names, fallbackName) {
    if (!Array.isArray(names)) {
        return fallbackName;
    }
    let germanName = names.find((entry) => entry.language.name === GERMAN_LANGUAGE);

    if (germanName) {
        return germanName.name;
    }
    return fallbackName;
}

function getPokemonDisplayName(pokemonData) {
    return pokemonData.germanName || pokemonData.name;
}

function getPokemonTypeDisplayName(pokemonData, index) {
    let typeData = pokemonData.types[index].type;

    return typeData.germanName || typeData.name;
}

function sortLoadedPokemon() {
    loadedPokemonData.sort(comparePokemonId);
}

function comparePokemonId(firstPokemon, secondPokemon) {
    return firstPokemon.id - secondPokemon.id;
}

function findLoadedPokemon(searchValue) {
    let search = String(searchValue).trim().toLowerCase();

    return loadedPokemonData.find((pokemon) => isSamePokemon(pokemon, search));
}

function isSamePokemon(pokemon, search) {
    return (
        String(pokemon.id) === search ||
        pokemon.name.toLowerCase() === search ||
        getPokemonDisplayName(pokemon).toLowerCase() === search
    );
}

async function getOrFetchPokemon(searchValue) {
    let storedPokemon = findLoadedPokemon(searchValue);

    if (storedPokemon) {
        if (await localizePokemonData(storedPokemon)) {
            saveToLocalStorage();
        }
        return storedPokemon;
    }
    return await fetchAndSavePokemon(searchValue);
}

async function fetchAndSavePokemon(searchValue) {
    let response = await fetch(`${BASE_URL}pokemon/${searchValue}`);

    if (!response.ok) {
        return null;
    }
    let pokemonData = await response.json();
    let loadedPokemon = await addLoadedPokemon(pokemonData);
    saveToLocalStorage();
    renderStoredPokemon();
    return loadedPokemon;
}

function renderStoredPokemon() {
    mainRef = document.getElementById("main");
    mainRef.innerHTML = "";

    for (let i = 0; i < loadedPokemonData.length; i++) {
        renderCard(loadedPokemonData[i]);
    }
    searchForPokemon();
}

function waitForBrowserRender() {
    return new Promise(resolveBrowserRender);
}

function resolveBrowserRender(resolve) {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
}

function definePokemonData(pokemonAsJson) {
    pName = getPokemonDisplayName(pokemonAsJson);
    pImg = pokemonAsJson.sprites.other["official-artwork"].front_default;
    pId = pokemonAsJson.id;
    pType = pokemonAsJson.types[0].type.name;
}

function renderCard(pokemonAsJson) {
    definePokemonData(pokemonAsJson);
    mainRef.innerHTML += cardTemplate();
    renderCardTypes(pokemonAsJson);
}

function renderCardTypes(pokemonAsJson) {
    for (let i = 0; i < pokemonAsJson.types.length; i++) {
        cardRef = document.getElementById(`card${pId}`);
        let types = pokemonAsJson.types[i].type.name;
        cardStatRef = document.getElementById(`card-info${pId}`);
        cardStatRef.innerHTML += returnCard(types, pokemonAsJson, i);
    }
}

async function loadMorePokemon() {
    toggleButton();

    try {
        await loadData();
    } finally {
        toggleButton();
    }
}

function openLoadingDialog() {
    let loadingDialogRef = document.getElementById("loading");

    hideLoadMoreButton();
    if (!loadingDialogRef.open) {
        openDialog(loadingDialogRef);
    }
}

function closeLoadingDialog() {
    let loadingDialogRef = document.getElementById("loading");

    if (loadingDialogRef.open) {
        loadingDialogRef.close();
    }
    updateLoadMoreButtonVisibility();
}

function hideLoadMoreButton() {
    document.getElementById("search-btn").classList.add("d-none");
}

function showLoadMoreButton() {
    document.getElementById("search-btn").classList.remove("d-none");
}

function updateLoadMoreButtonVisibility() {
    if (isSearchActive()) {
        hideLoadMoreButton();
    } else {
        showLoadMoreButton();
    }
}

function lockBackgroundScroll() {
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function openDialog(dialog) {
    dialog.showModal();
    lockBackgroundScroll();
}

function unlockBackgroundScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}

function toggleButton() {
    let btn = document.getElementById("search-btn");
    btn.disabled = !btn.disabled;
}

async function searchForPokemon() {
    let search = getSearchValue();
    let nameRefs = document.querySelectorAll(".pokemonName");

    if (search.length > 0 && search.length < 3) {
        return;
    }

    for (let i = 0; i < nameRefs.length; i++) {
        togglePokemonCard(nameRefs[i], search);
    }
    updateLoadMoreButtonVisibility();
}

function handleSearchInput(input) {
    syncSearchInputs(input);
    searchForPokemon();
}

function syncSearchInputs(sourceInput) {
    let inputs = getSearchInputs();

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] !== sourceInput) {
            inputs[i].value = sourceInput.value;
        }
    }
}

function togglePokemonCard(nameRef, search) {
    let card = nameRef.closest(".card");
    let pokemonId = card.querySelector(".pokemon-id").innerText;
    card.classList.toggle("d-none", !pokemonMatchesSearchText(nameRef.innerText, pokemonId, search));
}

function getSearchValue() {
    let input = document.getElementById("searchId");

    if (!input) {
        return "";
    }
    return input.value.trim().toLowerCase();
}

function getSearchInputs() {
    return [document.getElementById("searchId"), document.getElementById("mobileSearchId")].filter(Boolean);
}

function setSearchInputValue(value) {
    let inputs = getSearchInputs();

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = value;
    }
}

function isSearchActive() {
    return getSearchValue() !== "";
}

function getSearchResults() {
    let search = getSearchValue();

    if (!search) {
        return [];
    }
    return loadedPokemonData.filter((pokemon) => pokemonMatchesSearch(pokemon, search));
}

function pokemonMatchesSearch(pokemon, search) {
    return pokemonMatchesSearchText(getPokemonDisplayName(pokemon), `#${pokemon.id}`, search);
}

function pokemonMatchesSearchText(name, id, search) {
    let pokemonText = `${name} ${id}`.toLowerCase();
    return pokemonText.includes(search);
}

function onPokeballClick() {
    window.scrollTo({ top: 0 });
    clearSearchInput();
    searchForPokemon();
}

function openMobileSearch() {
    let dialog = document.getElementById("mobileSearchDialog");
    let input = document.getElementById("mobileSearchId");

    if (!dialog || !input) {
        return;
    }
    if (!dialog.open) {
        openDialog(dialog);
    }
    input.value = getSearchValue();
    setTimeout(() => input.focus(), 0);
}

function closeMobileSearch() {
    let dialog = document.getElementById("mobileSearchDialog");

    if (dialog && dialog.open) {
        dialog.close();
    }
}

function closeMobileSearchOnBackdrop(event) {
    if (isClickOutsideDialog(event)) {
        closeMobileSearch();
    }
}

function closeMobileSearchOnEscape(event) {
    if (event.key === "Escape") {
        closeMobileSearch();
    }
}
