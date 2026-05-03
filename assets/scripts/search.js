async function searchForPokemon() {
    let input = document.getElementById("search");
    let search = input.value;
    let nameRefs = document.querySelectorAll(".pokemonName");

    for (let i = 0; i < nameRefs.length; i++) {
        let pokemonName = nameRefs[i].innerText.toLowerCase();
        let card = nameRefs[i].parentElement;

        if (pokemonName.includes(search)) {
            card.classList.remove("d-none")
        }
        else {
            card.classList.add("d-none")
        }
    }
}
