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
    infoDialog.addEventListener("click", closeDialogOnBackdropClick);
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
}

async function definePokemonData(pokemonAsJson) {
    pName = pokemonAsJson.name;
    pImg = pokemonAsJson.sprites.other["official-artwork"].front_default;
    pId = pokemonAsJson.id;
    pType = pokemonAsJson.types[0].type.name;
}

function renderCard(ref, id) {
    mainRef = document.getElementById("main");
    mainRef.innerHTML += cardTemplate();

    for (let i = 0; i < ref.types.length; i++) {
        cardRef = document.getElementById(`card${pId}`);
        let types = ref.types[i].type.name;

        cardStatRef = document.getElementById(`card-info${pId}`);
        cardStatRef.innerHTML += `<span class="badge white ${renderBackgroundColor(types)} flex alig-i-c"> <p>${ref.types[i].type.name}</p> </span>`;
    }
}

function showLoadingDialog() {
    let loadingDialogRef = document.getElementById("loading");
    if (!loadingDialogRef.open) {
        loadingDialogRef.showModal();
    }
}
function closeLoadingDialog() {
    let loadingDialogRef = document.getElementById("loading");
    if (loadingDialogRef.open) {
        loadingDialogRef.close();
    }
}
