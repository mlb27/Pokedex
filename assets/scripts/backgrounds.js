function getBackgroundColorClass(type) {
    if (type) return `bg-${type}`;

    return "";
}

function renderBackgroundColor(type) {
    return getBackgroundColorClass(type);
}
