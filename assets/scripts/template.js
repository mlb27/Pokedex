function cardTemplate() {
    return `<div onclick="showDialog(${pId})" class="card" id="card${pId}">
                ${cardHeaderTemplate()}${cardTitleTemplate()}${cardInfoTemplate()}
            </div>`;
}

function cardHeaderTemplate() {
    return `<span class="cardHeader flex">
                <div class="card-bg-circle ${getBackgroundColorClass(pType)}"></div>
                <img src="${pImg}" alt="${pName}" />
            </span>`;
}

function cardTitleTemplate() {
    return `<div class="card-title flex flex-d-column alig-i-c">
                <h2 class="pokemonName">${pName}</h2><p class="pokemon-id fw-200">#${pId}</p>
            </div>`;
}

function cardInfoTemplate() {
    return `<div class="card-info flex jc-c alig-i-c" id="card-info${pId}"></div>`;
}

function returnStatTemplate(type) {
    return `<div class="stat">
                <p>${type}</p>
            </div>`;
}

function returnTypesTemplate(pokemonData, i) {
    return `<span class="badge white ${getBackgroundColorClass(pokemonData.types[i].type.name)} flex alig-i-c">
                <p>${pokemonData.types[i].type.name}</p> 
            </span>`;
}

function returnEvolutionTemplate(preEvolution, preImg) {
    return `
        <h2>${preEvolution.name}</h2>
        <img src="${preImg}" onclick="showDialog('${preEvolution.name}')" class="eEvoImg" />
    `;
}

function dialogTemplate() {
    return `${dialogArrowTemplate()}
            <div class="dialog-content">
                ${dialogHeaderTemplate()}${dialogAboutTemplate()}${dialogInfoTemplate()}${dialogStatsTemplate()}
            </div>`;
}

function dialogArrowTemplate() {
    return `${leftArrowTemplate()}${rightArrowTemplate()}`;
}

function leftArrowTemplate() {
    if (Number(eId) <= 1) {
        return "";
    }
    return `<button class="dialog-arrow dialog-arrow-left bg-grey" onclick="event.stopPropagation(); changePokemon('last')">&lsaquo;</button>`;
}

function rightArrowTemplate() {
    return `<button class="dialog-arrow dialog-arrow-right bg-grey" onclick="event.stopPropagation(); changePokemon('next')">&rsaquo;</button>`;
}

function dialogHeaderTemplate() {
    return `<header id="pokeHeader" class="${renderBackgroundColor(eMainType)}">
                <img src="${eImg}" alt="${eName}" />
            </header>`;
}

function dialogAboutTemplate() {
    return `<section class="about flex flex-d-column">
                <h2>${eName}</h2><p class="fw-200">#${eId}</p><br />
                <span id="eTypes" class="eTypes flex flex-d-row gap16"></span><br />
                <p class="italic">${eGermanText}</p>
            </section>`;
}

function dialogInfoTemplate() {
    return `<section class="info flex flex-d-row jc-sb"></section>`;
}

function dialogStatsTemplate() {
    return `<section class="stats flex jc-sb">
                <span><br />${dialogStatsListTemplate()}</span>${dialogEvolutionBlockTemplate()}
            </section>`;
}

function dialogStatsListTemplate() {
    return `${statItemTemplate("HP", 0)}${statItemTemplate("Angriff", 1)}${statItemTemplate("Verteidigung", 2)}
            ${statItemTemplate("Spezial Angriff", 3)}${statItemTemplate("Spezial Verteidigung", 4)}
            ${statItemTemplate("Geschwindigkeit", 5)}`;
}

function statItemTemplate(label, index) {
    return `<span><p class="fw-200">${label}</p><h2>${eStats[index].base_stat}</h2></span>`;
}

function dialogEvolutionBlockTemplate() {
    return `<span id="eEvo" class="eEvo"><br /><p class="fw-200">Entwickelt sich von:</p></span>`;
}

function returnCard(types, ref, i) {
    return `<span class="badge white ${renderBackgroundColor(types)} flex alig-i-c"> <p>${ref.types[i].type.name}</p> </span>`;
}

function renderBasePokemon(eEvoRef) {
    eEvoRef.innerHTML = `<br /> <h2>Base-Pokemon</h2> <p class="fw-200">keine Entwicklung</p>`;
}
