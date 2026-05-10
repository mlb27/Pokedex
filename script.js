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
const BASE_URL = "https://pokeapi.co/api/v2/";
const PAGE_SIZE = 40;

function init() {
    loadData();
    let infoDialog = document.getElementById("info");
    let loadingDialog = document.getElementById("loading");
    infoDialog.addEventListener("click", closeDialogOnBackdropClick);
    infoDialog.addEventListener("close", unlockBackgroundScroll);
    loadingDialog.addEventListener("close", unlockBackgroundScroll);
    window.addEventListener("keydown", changePokemonOnKeydown);
}

async function loadData() {
    let response = await fetch(`${BASE_URL}pokemon?limit=${PAGE_SIZE}&offset=${currentOffset}`);
    responseAsJson = await response.json();
    currentOffset += PAGE_SIZE;

    await getPokemonData();
}

async function getPokemonData() {
    showLoadingDialog();

    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemon = await fetch(responseAsJson.results[i].url);
        pokemonAsJson = await pokemon.json();

        await definePokemonData(pokemonAsJson);

        renderCard(pokemonAsJson);
    }

    closeLoadingDialog();

    enableButton();
}

async function definePokemonData(pokemonAsJson) {
    pName = pokemonAsJson.name;
    pImg = pokemonAsJson.sprites.other["official-artwork"].front_default;
    pId = pokemonAsJson.id;
    pType = pokemonAsJson.types[0].type.name;
}

function renderCard(pokemonAsJson) {
    mainRef = document.getElementById("main");
    mainRef.innerHTML += cardTemplate();

    for (let i = 0; i < pokemonAsJson.types.length; i++) {
        cardRef = document.getElementById(`card${pId}`);
        let types = pokemonAsJson.types[i].type.name;

        cardStatRef = document.getElementById(`card-info${pId}`);
        cardStatRef.innerHTML += returnCard(types, pokemonAsJson, i);
    }
}

function showLoadingDialog() {
    let loadingDialogRef = document.getElementById("loading");
    if (!loadingDialogRef.open) {
        openDialog(loadingDialogRef);
    }
}

function closeLoadingDialog() {
    let loadingDialogRef = document.getElementById("loading");
    if (loadingDialogRef.open) {
        loadingDialogRef.close();
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

function disableButton() {
    let btn = document.getElementById("search-btn");
    btn.disabled = true;
}

function enableButton() {
    let btn = document.getElementById("search-btn");
    btn.disabled = false;
}
