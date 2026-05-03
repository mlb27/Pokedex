function cardTemplate() {
    return `<div class="card">
                <h2>${pName}</h2>
                <img src="./assets/img/bulbasaur.png" alt="${pName}" />
                <p>#${pSerial}</p>
                <div class="card-info flex flex-d-column align-i-fs"
                    id="card-info">
                    ${returnStatTemplate()}
                </div>
            </div>`;
}

function returnStatTemplate() {
    return `<div class="stat">
                <p>${pStat}</p>
            </div>`;
}
