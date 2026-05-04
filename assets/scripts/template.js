function cardTemplate() {
    return `<div onclick="showDialog(${pSerial})" class="card" id="card${pSerial}">
                <h2 class="pokemonName">${pName}</h2>
                <img src="${pImg}" alt="${pName}" />
                <p>#${pSerial}</p>
                <div class="card-info flex flex-d-column align-i-fs" id="card-info${pSerial}"></div>
            </div>`;
}

function returnStatTemplate(type) {
    return `<div class="stat">
                <p>${type}</p>
            </div>`;
}
