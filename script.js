let mainRef;
let cardRef;
let cardStatRef;

let responseAsJson;
let pokemonAsJson;
let loadedPokemon = {};

let pName;
let pSerial;
let pImg;

let currentOffset = 0;
const BASE_URL = "https://pokeapi.co/api/v2/";
const PAGE_SIZE = 40;

function init() {
    document.getElementById("info").addEventListener("close", resetInfoDialog);
    loadData();
}

async function loadData() {
    let response = await fetch(`${BASE_URL}pokemon?limit=${PAGE_SIZE}&offset=${currentOffset}`);
    responseAsJson = await response.json();
    currentOffset += PAGE_SIZE;

    await getPokemonData(responseAsJson);
}

async function loadMore() {
    await loadData();
}

async function getPokemonData(responseAsJson) {
    let loadingDialogRef = document.getElementById("loading");
    loadingDialogRef.showModal();

    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemon = await fetch(responseAsJson.results[i].url);
        pokemonAsJson = await pokemon.json();

        pName = pokemonAsJson.name;
        pSerial = pokemonAsJson.id;
        pImg = pokemonAsJson.sprites.front_default;

        renderCard(pokemonAsJson, pSerial);
        searchForPokemon();
    }

    loadingDialogRef.close();
}

function renderCard(ref, id) {
    mainRef = document.getElementById("main");
    mainRef.innerHTML += cardTemplate();

    for (let i = 0; i < ref.types.length; i++) {
        cardRef = document.getElementById(`card${pSerial}`);
        const type = ref.types[i].type.name;

        cardStatRef = document.getElementById(`card-info${pSerial}`);
        cardStatRef.innerHTML += returnStatTemplate(type);

        renderBackgroundColor(type);
    }
}
