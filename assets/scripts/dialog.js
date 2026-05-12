let dialogRef;
let pokeHeaderRef;

let eName;
let eMainType;
let eImg;
let eId;
let eGermanInfo;
let eGermanText;
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
    let pokemonData = await getOrFetchPokemon(id);

    if (!pokemonData) {
        showNotFoundDialog();
        return;
    }
    let speciesData = await getOrFetchSpecies(pokemonData);
    if (!speciesData) {
        showNotFoundDialog();
        return;
    }
    definePokemonInfo(pokemonData, speciesData);
}

async function getOrFetchSpecies(pokemonData) {
    let storedSpecies = findLoadedSpecies(pokemonData.id);

    if (storedSpecies) {
        return storedSpecies.speciesData;
    }
    return await fetchAndSaveSpecies(pokemonData);
}

function findLoadedSpecies(id) {
    return extendedLoadedPokemon.find((info) => Number(info.id) === Number(id));
}

async function fetchAndSaveSpecies(pokemonData) {
    let response = await fetch(pokemonData.species.url);

    if (!response.ok) {
        return null;
    }
    let speciesData = normalizeSpeciesData(await response.json());
    extendedLoadedPokemon.push({ id: pokemonData.id, speciesData: speciesData });
    saveToLocalStorage();
    return speciesData;
}

function normalizeSpeciesData(speciesData) {
    return {
        germanText: getGermanText(speciesData),
        evolves_from_species: speciesData.evolves_from_species,
    };
}

function getGermanText(speciesData) {
    eGermanInfo = speciesData.flavor_text_entries.find((entry) => entry.language.name === "de");

    if (!eGermanInfo) {
        return "Keine deutsche Beschreibung gefunden.";
    }
    return eGermanInfo.flavor_text.replace(/\s+/g, " ");
}

function definePokemonInfo(pokemonData, speciesData) {
    eName = pokemonData.name;
    eMainType = pokemonData.types[0].type.name;
    eImg = pokemonData.sprites.other["official-artwork"].front_default;
    eId = pokemonData.id;
    eStats = pokemonData.stats;
    eGermanText = speciesData.germanText;
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
    let prePokemonData = await getOrFetchPokemon(preEvolution.name);

    if (!prePokemonData) {
        return;
    }
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
    openInfoDialog();
    notFoundTimeout = setTimeout(closeNotFoundDialog, 2200);
}

function closeNotFoundDialog() {
    if (dialogRef.open) {
        dialogRef.close();
    }
    resetInfoDialogStyle();
}

function changePokemon(direction) {
    let nextId = getNextPokemonId(direction);

    if (nextId < 1) {
        return;
    }
    showDialog(nextId);
}

function getNextPokemonId(direction) {
    if (direction === "last") {
        return Number(eId) - 1;
    }
    return Number(eId) + 1;
}

function changePokemonOnKeydown(event) {
    let infoDialog = document.getElementById("info");

    if (!infoDialog.open || infoDialog.classList.contains("not-found-dialog")) {
        return;
    }
    handleArrowKey(event);
}

function handleArrowKey(event) {
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
    if (!isBackdropClick(event) || event.target.closest(".dialog-arrow")) {
        return;
    }
    event.currentTarget.close();
    resetInfoDialogStyle();
}

function isBackdropClick(event) {
    let dialogDimensions = event.currentTarget.getBoundingClientRect();

    return (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
    );
}
