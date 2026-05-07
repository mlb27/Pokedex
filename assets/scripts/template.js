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
