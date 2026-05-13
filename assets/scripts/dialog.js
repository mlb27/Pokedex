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

    if (storedSpecies?.speciesData?.germanName) {
        return storedSpecies.speciesData;
    }
    let fetchedSpecies = await fetchAndSaveSpecies(pokemonData);

    return fetchedSpecies || storedSpecies?.speciesData || null;
}

function findLoadedSpecies(id) {
    return extendedLoadedPokemon.find((info) => Number(info.id) === Number(id));
}

async function fetchAndSaveSpecies(pokemonData) {
    try {
        let response = await fetch(pokemonData.species.url);

        if (!response.ok) {
            return null;
        }
        let speciesData = normalizeSpeciesData(await response.json());
        saveSpeciesData(pokemonData.id, speciesData);
        saveToLocalStorage();
        return speciesData;
    } catch (error) {
        return null;
    }
}

function saveSpeciesData(id, speciesData) {
    let storedSpecies = findLoadedSpecies(id);

    if (storedSpecies) {
        storedSpecies.speciesData = speciesData;
        return;
    }
    extendedLoadedPokemon.push({ id: id, speciesData: speciesData });
}

function normalizeSpeciesData(speciesData) {
    return {
        germanName: getLocalizedName(speciesData.names, speciesData.name),
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
    eName = getPokemonDisplayName(pokemonData);
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
    await localizePokemonData(prePokemonData);
    let preImg = prePokemonData.sprites.other["official-artwork"].front_default;
    eEvoRef.innerHTML += returnEvolutionTemplate(getPokemonDisplayName(prePokemonData), prePokemonData.id, preImg);
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

    if (!nextId || nextId < 1) {
        return;
    }
    showDialog(nextId);
}

function getNextPokemonId(direction) {
    if (isSearchActive()) {
        return getNextSearchPokemonId(direction);
    } else {
        return getNextDefaultPokemonId(direction);
    }
}

function getNextDefaultPokemonId(direction) {
    if (direction === "last") {
        return Number(eId) - 1;
    } else {
        return Number(eId) + 1;
    }
}

function getNextSearchPokemonId(direction) {
    let searchResults = getSearchResults();

    if (searchResults.length === 0) {
        return null;
    }
    let currentIndex = searchResults.findIndex((pokemon) => Number(pokemon.id) === Number(eId));
    let nextIndex = getNextSearchIndex(currentIndex, direction, searchResults.length);
    return searchResults[nextIndex].id;
}

function getNextSearchIndex(currentIndex, direction, resultCount) {
    if (direction === "last") {
        return getPreviousSearchIndex(currentIndex, resultCount);
    } else {
        return getFollowingSearchIndex(currentIndex, resultCount);
    }
}

function getPreviousSearchIndex(currentIndex, resultCount) {
    if (currentIndex <= 0) {
        return resultCount - 1;
    }
    return currentIndex - 1;
}

function getFollowingSearchIndex(currentIndex, resultCount) {
    if (currentIndex === -1 || currentIndex >= resultCount - 1) {
        return 0;
    }
    return currentIndex + 1;
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
