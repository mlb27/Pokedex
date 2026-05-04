let dialogRef = "";

let eName;
let eAbilities = [];
let eStats = [];

function showDialog(id) {
    dialogRef = document.getElementById("info");
    let selectedRef = document.getElementById(`card${id}`);
    let selectedPokemon = id;

    // Reset Dialog
    dialogRef.innerHTML = "";
    dialogRef.className = "";

    dialogRef.className = selectedRef.className;
    dialogRef.classList.remove("card");

    getExtendedInfo(selectedPokemon);
}

async function getExtendedInfo(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemonData = await response.json();

    // console.log(pokemonData);
    eAbilities = pokemonData.abilities;
    eStats = pokemonData.stats;
    renderInfo(eAbilities, eStats);
}

function renderInfo(eAbilities, eStats) {
    renderAbilities(eAbilities);
    renderStats(eStats);
    dialogRef.showModal();
}

function renderAbilities(eAbilities) {
    dialogRef.innerHTML += `<label class="label">Abilities</label>`;
    for (let i = 0; i < eAbilities.length; i++) {
        dialogRef.innerHTML += `<p class="eAbility">${eAbilities[i].ability.name}</p>`;
    }
}

function renderStats(e) {
    dialogRef.innerHTML += `<br><label class="label">Stats</label>`;
    for (let i = 0; i < eStats.length; i++) {
        if (eStats[i].base_stat > 100) {
            dialogRef.innerHTML += returnCircleProgress(eStats[i].stat.name, eStats[i].base_stat, eStats[i].base_stat);
        } else {
            dialogRef.innerHTML += returnCircleProgress(eStats[i].stat.name, eStats[i].base_stat, 100);
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
