let mainRef;
let cardRef;
let cardStatRef;

let responseAsJson;
let pokemonAsJson;

let pName;
let pSerial;
let pImg;

let currentOffset = 0;
const BASE_URL = "https://pokeapi.co/api/v2/";
const PAGE_SIZE = 50;

function init() {
    loadData();
}

async function loadData() {
    let response = await fetch(`${BASE_URL}pokemon?limit=${PAGE_SIZE}&offset=${currentOffset}`);
    responseAsJson = await response.json();
    currentOffset += PAGE_SIZE;

    await getPokemonData(responseAsJson);
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
    let type = ref.types[0].type.name;

    for (let i = 0; i < ref.types.length; i++) {
        cardRef = document.getElementById(`card${pSerial}`);
        let types = ref.types[i].type.name;

        cardStatRef = document.getElementById(`card-info${pSerial}`);
        cardStatRef.innerHTML += returnStatTemplate(types);
    }

    renderBackgroundColor(type);
}
