function cardTemplate() {
    return `<div onclick="showDialog(${pId})" class="card" id="card${pId}">
                
                <span class="cardHeader flex">
                    <div class="card-bg-circle ${getBackgroundColorClass(pType)}"></div>
                    <img src="${pImg}" alt="${pName}" />
                </span>

                <div class="card-title flex flex-d-column alig-i-c">
                    <h2 class="pokemonName">${pName}</h2>
                    <p class="pokemon-id fw-200">#${pId}</p>
                </div>
                <div class="card-info flex jc-c alig-i-c" id="card-info${pId}"></div>
            </div>`;
}

function returnStatTemplate(type) {
    return `<div class="stat">
                <p>${type}</p>
            </div>`;
}

function returnTypesTemplate(pokemonData, i) {
    console.log(pokemonData);

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
    return `${Number(eId) > 1 ? `<button class="dialog-arrow dialog-arrow-left bg-grey" onclick="event.stopPropagation(); changePokemon('last')">&lsaquo;</button>` : ""}
            <button class="dialog-arrow dialog-arrow-right bg-grey" onclick="event.stopPropagation(); changePokemon('next')">&rsaquo;</button>
            <div class="dialog-content">
                <header id="pokeHeader" class="${renderBackgroundColor(eMainType)}">
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
                </section>
            </div>`;
}

function returnCard(types, ref, i) {
    return `<span class="badge white ${renderBackgroundColor(types)} flex alig-i-c"> <p>${ref.types[i].type.name}</p> </span>`;
}

function renderBasePokemon(eEvoRef) {
    eEvoRef.innerHTML = `<br /> <h2>Base-Pokemon</h2> <p class="fw-200">keine Entwicklung</p>`;
}
