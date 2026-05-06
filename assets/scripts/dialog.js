let dialogRef;
let pokeHeaderRef;

let eName;
let eMainType;
let eImg;
let eId;
let eGermanInfo;

function showDialog(id) {
    dialogRef = document.getElementById("info");
    dialogRef.innerHTML = "";
    let selectedRef = document.getElementById(`card${id}`);
    let selectedPokemon = id;

    // dialogRef.className = selectedRef.className;
    getExtendedInfo(selectedPokemon);
}

async function getExtendedInfo(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemonData = await response.json();
    let speciesResponse = await fetch(pokemonData.species.url);
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

    eGermanInfo = speciesData.flavor_text_entries.find((entry) => entry.language.name === "de");
    eGermanText = eGermanInfo ? eGermanInfo.flavor_text.replace(/\s+/g, " ") : "Keine deutsche Beschreibung gefunden.";

    renderDialog(pokemonData, speciesData);
}

async function renderDialog(pokemonData, speciesData) {
    dialogRef.innerHTML = await dialogTemplate();

    let eTypesRef = await document.getElementById("eTypes");
    for (let i = 0; i < pokemonData.types.length; i++) {
        eTypesRef.innerHTML += `<span class="badge white ${renderBackgroundColor(pokemonData.types[i].type.name)}"> <p>${pokemonData.types[i].type.name}</p> </span>`;
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

    dialogRef.showModal();
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
                <br />
            </section>
            <section class="info flex flex-d-row jc-sb">
                <span class="flex flex-d-column">
                    <p class="fw-200">Gewicht</p>
                    <h2>90,5 kg</h2>
                </span>
                <span class="flex flex-d-column">
                    <p class="fw-200">Größe</p>
                    <h2>1,7m</h2>
                </span>
                <span class="flex flex-d-column">
                    <p class="fw-200">Hauptfähigkeit</p>
                    <h2>Blaze</h2>
                </span>
            </section>

            <section class="stats flex jc-sb">
                <span>
                    <br />
                    <span>
                        <p class="fw-200">HP</p>
                        <div class="progress">
                            <div class="progress-value hp"></div>
                        </div>
                    </span>
                    <br />
                    <span>
                        <p class="fw-200">Angriff</p>
                        <div class="progress">
                            <div class="progress-value atk"></div>
                        </div>
                    </span>
                    <br />
                    <span>
                        <p class="fw-200">Verteidigung</p>
                        <div class="progress">
                            <div class="progress-value def"></div>
                        </div>
                    </span>
                    <br />
                    <span>
                        <p class="fw-200">Spezial Angriff</p>
                        <div class="progress">
                            <div class="progress-value sp-atk"></div>
                        </div>
                    </span>
                    <br />
                    <span>
                        <p class="fw-200">Spezial Verteidigung</p>
                        <div class="progress">
                            <div class="progress-value sp-def"></div>
                        </div>
                    </span>
                    <br />
                    <span>
                        <p class="fw-200">Geschwindigkeit</p>
                        <div class="progress">
                            <div class="progress-value speed"></div>
                        </div>
                    </span>
                </span>
                <span id="eEvo" class="eEvo">
                    <br />
                    <p class="fw-200">Entwickelt sich von:</p>
                </span>
            </section>`;
}
