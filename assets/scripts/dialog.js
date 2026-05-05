let dialogRef;
let infoWrapper;
let infoWrapperRef;

let eName;
let eAbilities = [];
let eStats = [];

function showDialog(id) {
    dialogRef = document.getElementById("info");
    dialogRef.innerHTML = "";
    infoWrapper = `<div class="infoWrapper" id="infoWrapper"></div>`;
    let selectedRef = document.getElementById(`card${id}`);
    let selectedPokemon = id;
    dialogRef.className = "";

    dialogRef.className = selectedRef.className;
    dialogRef.classList.remove("card");
    dialogRef.classList.add("flex", "flex-d-column");
    getExtendedInfo(selectedPokemon);
}

async function getExtendedInfo(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemonData = await response.json();
    let type = [];

    console.log(pokemonData);
    eAbilities = pokemonData.abilities;
    eStats = pokemonData.stats;

    dialogRef.innerHTML += `
        <div class="pokemonHeader">
            <div class="pokemonTitle" id="pokemonTitle">
                <h1>${pokemonData.name}</h1>
                <p>#${pokemonData.id}</p>
            </div>

            <div class="pokemonImages">
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <img src="${pokemonData.sprites.back_default}" alt="${pokemonData.name}">
            </div>
        </div>
        `;

    dialogRef.innerHTML += infoWrapper;

    for (let i = 0; i < pokemonData.types.length; i++) {
        type.push(pokemonData.types[i].type.name);
        let headerRef = document.getElementById("pokemonTitle");
        headerRef.innerHTML += `<div class="stat flex"><p>${type[i]}</p></div>`;
    }

    infoWrapperRef = document.getElementById("infoWrapper");
    renderExtendedInfo(eAbilities, eStats);
}

function renderExtendedInfo(eAbilities, eStats) {
    renderAbilities(eAbilities);
    renderStats(eStats);
    dialogRef.showModal();
}

function renderAbilities(eAbilities) {
    infoWrapperRef.innerHTML += `<label class="label">Abilities</label>`;
    for (let i = 0; i < eAbilities.length; i++) {
        infoWrapperRef.innerHTML += `<p class="eAbility">${eAbilities[i].ability.name}</p>`;
    }
}

function renderStats(e) {
    infoWrapperRef.innerHTML += `<br><label class="label">Stats</label>`;
    for (let i = 0; i < eStats.length; i++) {
        if (eStats[i].base_stat > 100) {
            infoWrapperRef.innerHTML += returnCircleProgress(eStats[i].stat.name, eStats[i].base_stat, eStats[i].base_stat);
        } else {
            infoWrapperRef.innerHTML += returnCircleProgress(eStats[i].stat.name, eStats[i].base_stat, 100);
        }
    }
}
function returnCircleProgress(statName, value, max) {
    const label = statName.replaceAll("-", " ");

    return `
        <div class="statProgress">
            <span class="statLabel">${label}</span>
            <circle-progress class="e${statName}" value="${value}" max="${max}"></circle-progress>
        </div>
    `;
}

function closeDialog() {
    dialogRef.close();
    resetInfoDialog();
}

function resetInfoDialog() {
    dialogRef.innerHTML = "";
    dialogRef.className = "";
}
