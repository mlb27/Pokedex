let dialogRef;
let pokeHeaderRef;

let eName;
let eMainType;
let eImg;
let eId;
let eGermanInfo;
let eStats;
let notFoundTimeout;

function showDialog(id) {
    clearTimeout(notFoundTimeout);
    dialogRef = document.getElementById("info");
    resetInfoDialogStyle();
    dialogRef.innerHTML = "";
    let selectedPokemon = String(id).trim().toLowerCase();

    if (!selectedPokemon) {
        showNotFoundDialog();
        return;
    }

    getExtendedInfo(selectedPokemon);
}

async function getExtendedInfo(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
        showNotFoundDialog();
        return;
    }
    let pokemonData = await response.json();
    let speciesResponse = await fetch(pokemonData.species.url);
    if (!speciesResponse.ok) {
        showNotFoundDialog();
        return;
    }
    let speciesData = await speciesResponse.json();

    definePokemonInfo(pokemonData, speciesData);
}

function definePokemonInfo(pokemonData, speciesData) {
    eName = pokemonData.name;
    eMainType = pokemonData.types[0].type.name;
    eImg = pokemonData.sprites.other["official-artwork"].front_default;
    eId = pokemonData.id;
    eStats = pokemonData.stats;

    eGermanInfo = speciesData.flavor_text_entries.find((entry) => entry.language.name === "de");
    eGermanText = eGermanInfo ? eGermanInfo.flavor_text.replace(/\s+/g, " ") : "Keine deutsche Beschreibung gefunden.";

    renderDialog(pokemonData, speciesData);
}

async function renderDialog(pokemonData, speciesData) {
    dialogRef.innerHTML = await dialogTemplate();
    renderDialogTypes(pokemonData);
    await renderDialogEvolution(speciesData);
    openInfoDialog();
}

function renderDialogTypes(pokemonData) {
    let eTypesRef = document.getElementById("eTypes");
    for (let i = 0; i < pokemonData.types.length; i++) {
        eTypesRef.innerHTML += returnTypesTemplate(pokemonData, i);
    }
}

async function renderDialogEvolution(speciesData) {
    let eEvoRef = document.getElementById("eEvo");
    let preEvolution = speciesData.evolves_from_species;

    if (preEvolution) {
        await renderPreEvolution(eEvoRef, preEvolution);
    } else {
        renderBasePokemon(eEvoRef);
    }
}

async function renderPreEvolution(eEvoRef, preEvolution) {
    let preResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${preEvolution.name}`);
    let prePokemonData = await preResponse.json();
    let preImg = prePokemonData.sprites.other["official-artwork"].front_default;
    eEvoRef.innerHTML += returnEvolutionTemplate(preEvolution, preImg);
}

function openInfoDialog() {
    if (!dialogRef.open) {
        openDialog(dialogRef);
    }
}

function showNotFoundDialog() {
    dialogRef.classList.remove("bg-grey");
    dialogRef.classList.add("bg-s-grey", "not-found-dialog");
    dialogRef.innerHTML = `<p>Pokemon wurde nicht gefunden.</p>`;

    if (!dialogRef.open) {
        openDialog(dialogRef);
    }

    notFoundTimeout = setTimeout(() => {
        if (dialogRef.open) {
            dialogRef.close();
        }
        resetInfoDialogStyle();
    }, 2200);
}

function changePokemon(direction) {
    let nextId = Number(eId);

    if (direction === "last") {
        nextId -= 1;
    }
    if (direction === "next") {
        nextId += 1;
    }
    if (nextId < 1) {
        return;
    }

    showDialog(nextId);
}

function changePokemonOnKeydown(event) {
    let infoDialog = document.getElementById("info");

    if (!infoDialog.open || infoDialog.classList.contains("not-found-dialog")) {
        return;
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        changePokemon("last");
    }
    if (event.key === "ArrowRight") {
        event.preventDefault();
        changePokemon("next");
    }
}

function resetInfoDialogStyle() {
    dialogRef.classList.remove("bg-s-grey", "not-found-dialog");
    dialogRef.classList.add("bg-grey");
}

function closeDialogOnBackdropClick(event) {
    let dialogDimensions = event.currentTarget.getBoundingClientRect();

    let clickedOutside =
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom;

    if (clickedOutside) {
        if (event.target.closest(".dialog-arrow")) {
            return;
        }
        event.currentTarget.close();
        resetInfoDialogStyle();
    }
}
