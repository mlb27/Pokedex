let mainRef = "";
let cardStatRef = "";

let response = "";
let responseAsJson = "";

let pokemon = "";
let pokemonAsJson = "";
let currentLimit = 10;

let pName = "";
let pSerial = "";
let pStat = "";
let pImg = "";

const BASE_URL = "https://pokeapi.co/api/v2/";
const LIMIT = "pokemon?limit=" + currentLimit + "&offset=0";

function init() {
    loadData();
}

async function loadData() {
    response = await fetch(BASE_URL + LIMIT);
    responseAsJson = await response.json();
    getPokemonData();
}

async function getPokemonData() {
    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemon = await fetch(responseAsJson.results[i].url);
        pokemonAsJson = await pokemon.json();

        pName = pokemonAsJson.name;
        pSerial = pokemonAsJson.id;
        renderCard(pName, pSerial);
        getPokemonType(pokemonAsJson);
    }
}

function getPokemonType(ref) {
    for (let i = 0; i < ref.types.length; i++) {
        stat = ref.types[i].type.name;
        renderStat(stat);
    }
}

function renderCard(name, serial) {
    mainRef = document.getElementById("main");
    mainRef.innerHTML += cardTemplate(name, serial);

    renderStat("test");
}

function renderStat(stat) {
    cardStatRef;
}
