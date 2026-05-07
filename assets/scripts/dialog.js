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
    dialogRef.className = "bg-grey";
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

    console.log(pokemonData);

    console.log(speciesData);

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

    let eTypesRef = await document.getElementById("eTypes");
    for (let i = 0; i < pokemonData.types.length; i++) {
        eTypesRef.innerHTML += `<span class="badge white ${getBackgroundColorClass(pokemonData.types[i].type.name)} flex alig-i-c"> <p>${pokemonData.types[i].type.name}</p> </span>`;
    }
    let eEvoRef = document.getElementById("eEvo");
    let preEvolution = speciesData.evolves_from_species;

    if (preEvolution) {
        let preResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${preEvolution.name}`);
        let prePokemonData = await preResponse.json();
        let preImg = prePokemonData.sprites.other["official-artwork"].front_default;

        eEvoRef.innerHTML += `
        <h2>${preEvolution.name}</h2>
        <img src="${preImg}" onclick="showDialog('${preEvolution.name}')" class="eEvoImg" />
    `;
    } else {
        eEvoRef.innerHTML = `<br /> <h2>Base-Pokemon</h2> <p class="fw-200">keine Entwicklung</p>`;
    }

    if (!dialogRef.open) {
        dialogRef.showModal();
    }
}

function showNotFoundDialog() {
    dialogRef.className = "bg-s-grey not-found-dialog";
    dialogRef.innerHTML = `<p>Pokemon wurde nicht gefunden.</p>`;

    if (!dialogRef.open) {
        dialogRef.showModal();
    }

    notFoundTimeout = setTimeout(() => {
        if (dialogRef.open) {
            dialogRef.close();
        }
    }, 2200);
}

function dialogTemplate() {
    return `<header id="pokeHeader" class="${renderBackgroundColor(eMainType)}">
                <img src="${eImg}" alt="charizard" />
            </header>
            <section class="about flex flex-d-column">
                <h2>${eName}</h2>
                <p class="fw-200">#${eId}</p>
                <br />
                <span id="eTypes" class="eTypes flex flex-d-row gap16">
                </span>
                <br />
                <p class="italic">${eGermanText}</p>
            </section>
            <section class="info flex flex-d-row jc-sb">

            </section>

            <section class="stats flex jc-sb">
                <span>
                    <br />
                    <span>
                        <p class="fw-200">HP</p>
                        <h2>${eStats[0].base_stat}</h2>
                    </span>
                    <span>
                        <p class="fw-200">Angriff</p>
                        <h2>${eStats[1].base_stat}</h2>
                    </span>
                    <span>
                        <p class="fw-200">Verteidigung</p>
                        <h2>${eStats[2].base_stat}</h2>
                    </span>
                    <span>
                        <p class="fw-200">Spezial Angriff</p>
                        <h2>${eStats[3].base_stat}</h2>
                    </span>
                    <span>
                        <p class="fw-200">Spezial Verteidigung</p>
                        <h2>${eStats[4].base_stat}</h2>
                    </span>
                    <span>
                        <p class="fw-200">Geschwindigkeit</p>
                        <h2>${eStats[5].base_stat}</h2>
                    </span>
                </span>
                <span id="eEvo" class="eEvo">
                    <br />
                    <p class="fw-200">Entwickelt sich von:</p>
                </span>
            </section>`;
}

function closeDialogOnBackdropClick(event) {
    let dialogDimensions = event.currentTarget.getBoundingClientRect();

    let clickedOutside =
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom;

    if (clickedOutside) {
        event.currentTarget.close();
    }
}
