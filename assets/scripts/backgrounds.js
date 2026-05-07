function getBackgroundColorClass(type) {
    if (type == "fire") {
        return `bg-fire`;
    }
    if (type == "grass") {
        return `bg-grass`;
    }
    if (type == "water") {
        return `bg-water`;
    }
    if (type == "bug") {
        return `bg-bug`;
    }
    if (type == "normal") {
        return `bg-normal`;
    }
    if (type == "ground") {
        return `bg-ground`;
    }
    if (type == "poison") {
        return `bg-poison`;
    }
    if (type == "fairy") {
        return `bg-fairy`;
    }
    if (type == "electric") {
        return `bg-electric`;
    }
    if (type == "fighting") {
        return `bg-fighting`;
    }
    if (type == "psychic") {
        return `bg-psychic`;
    }
    if (type == "flying") {
        return `bg-flying`;
    }
    if (type == "ice") {
        return `bg-ice`;
    }
    if (type == "dragon") {
        return `bg-dragon`;
    }
    if (type == "dark") {
        return `bg-dark`;
    }
    if (type == "rock") {
        return `bg-rock`;
    }
    if (type == "ghost") {
        return `bg-ghost`;
    }

    return "";
}

function renderBackgroundColor(type) {
    return getBackgroundColorClass(type);
}
