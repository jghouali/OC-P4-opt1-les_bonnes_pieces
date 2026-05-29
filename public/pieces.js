const filtresSection = document.querySelector(".filtres");
const fichesSection = document.querySelector(".fiches");

async function showFiltersForm() {
    const pieces = await getPieces();
    let filtresForm = document.createElement("form");
    let supprFiltres = Object.assign(document.createElement('a'), {
        innerText: "supprimer les filtres",
        classList: "clickable"
    })
    filtresForm.appendChild(supprFiltres);

    let categories = [...new Set(pieces.map(piece => (piece.categorie === undefined) ? "Sans categorie" : piece.categorie))].sort();
    categories.forEach(categorie => {
        let filtresCheckbox = Object.assign(document.createElement('input'), {
            type: "checkbox",
            name: categorie,
            value: categorie
        });

        let filtresLabel = Object.assign(document.createElement('label'), {
            for: categorie,
            innerHTML: categorie + '<br>'
        });

        let filtresDiv = Object.assign(document.createElement("div"), {
            classList: "filtresRow",
        });
        filtresDiv.append(filtresCheckbox, filtresLabel);
        filtresForm.appendChild(filtresDiv);

        filtresCheckbox.addEventListener("change", () => applyFilters(pieces));
    });

    let sliderMinLabel = Object.assign(document.createElement("label"), {
        for: "sliderMin",
        classList: "sliderMinLabel"
    });
    let sliderMin = Object.assign(document.createElement("input"), {
        type: "range",
        name: "sliderMin",
        min: 0,
        max: 200,
        value: 0
    });
    filtresForm.append(sliderMinLabel, sliderMin);
    sliderMinLabel.innerHTML = `<br>Prix Min : ${sliderMin.value} €<br>`;

    let sliderMaxLabel = Object.assign(document.createElement("label"), {
        for: "sliderMax",
        classList: "sliderMaxLabel"
    });
    let sliderMax = Object.assign(document.createElement("input"), {
        type: "range",
        name: "sliderMax",
        Max: 0,
        max: 200,
        value: 200
    });
    filtresForm.append(sliderMaxLabel, sliderMax);
    sliderMaxLabel.innerHTML = `<br>Prix Max : ${sliderMax.value} €<br>`;

    let sortSelect = Object.assign(document.createElement("select"), {
        name: "sortSelect"
    });
    let sortSelectLabel = Object.assign(document.createElement("label"), {
        for: "sortSelect",
        innerText: "Tri :"
    });
    filtresForm.append(sortSelectLabel, sortSelect);

    let optionByPriceAsc = Object.assign(document.createElement("option"), {
        value: "priceAsc",
        innerText: "prix croissant"
    });

    let optionByPriceDesc = Object.assign(document.createElement("option"), {
        value: "priceDesc",
        innerText: "prix decroissant"
    });

    let optionNotSorted = Object.assign(document.createElement("option"), {
        value: "notSorted",
        innerText: "non trié",
        selected: true
    });
    sortSelect.append(optionNotSorted, optionByPriceAsc, optionByPriceDesc);

    filtresForm.classList.add("filtresForm");
    filtresSection.appendChild(filtresForm);

    // Event Listeners
    filtresForm.addEventListener("submit", () => event.preventDefault);

    sortSelect.addEventListener("change", () => applyFilters());

    sliderMin.addEventListener("change", function () {
        updatePriceSlidersInfo();
        applyFilters();
    })
    sliderMax.addEventListener("change", function () {
        updatePriceSlidersInfo();
        applyFilters();
    })

    supprFiltres.addEventListener("click", function () {
        deleteFilters();
        applyFilters();
    })
}

async function applyFilters() {

    let pieces = await getPieces();

    pieces = applyCategorieFilter(pieces);
    pieces = applyPriceFilter(pieces);
    pieces = sortProducts(pieces);
    showProducts(pieces);
}

function applyCategorieFilter(piecesArray) {
    let selected = [...document.querySelectorAll(".filtresRow input")]
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    console.log(selected);
    console.log(piecesArray);

    //return (selected.length !== 0) ? piecesArray.filter(piece => selected.includes(piece.categorie)) : Array.from(piecesArray);
    if (selected.length !== 0) {
        return piecesArray.filter(piece => {
            if (piece.categorie === undefined) {
                return selected.includes("Sans categorie");
            } else {
                return selected.includes(piece.categorie);
            }
        });
    } else {
        return Array.from(piecesArray);
    }
}

function applyPriceFilter(piecesArray) {
    let min = document.querySelector('.filtresForm input[name=sliderMin]').value;
    let max = document.querySelector('.filtresForm input[name=sliderMax]').value;

    return piecesArray.filter(piece => piece.prix >= min && piece.prix <= max);
}


function sortProducts(piecesArray) {
    const piecesOrdonnees = Array.from(piecesArray);
    let arg = document.querySelector('.filtresForm select').value;

    if (arg === 'priceAsc') {
        piecesOrdonnees.sort((a, b) => {
            return a.prix - b.prix;
        })
    } else if (arg === 'priceDesc') {
        piecesOrdonnees.sort((a, b) => {
            return b.prix - a.prix;
        })
    }

    return piecesOrdonnees;
}

function updatePriceSlidersInfo() {
    let sliderMin = document.querySelector('.filtresForm input[name=sliderMin]');
    let sliderMax = document.querySelector('.filtresForm input[name=sliderMax]');
    let sliderMinLabel = document.querySelector('.sliderMinLabel');
    let sliderMaxLabel = document.querySelector('.sliderMaxLabel');
    let min = Number(sliderMin.value);
    let max = Number(sliderMax.value);

    if (min > max) {
        min = max;
        sliderMin.value = min;
    }

    sliderMinLabel.innerHTML = `<br>Prix Min : ${min} €<br>`;
    sliderMaxLabel.innerHTML = `<br>Prix Max : ${max} €<br>`;
}
function deleteFilters() {
    let checkboxes = document.querySelectorAll(".filtresRow input");
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    applyFilters();
}

async function showProducts(piecesArray) {
    fichesSection.replaceChildren();
    console.log(piecesArray);
    for (const piece of piecesArray) {
        let pieceDiv = document.createElement("div");
        pieceDiv.classList.add("fiche");
        let avis = await getAvis(piece.id);
        pieceDiv.innerHTML = `
    <img src="${piece.image}">
    <h2>${piece.nom}</h2>
    <p>
    Description :<br>${piece.description ?? "Pas de description"}<br><br>
    ${piece.prix}€<br>
    ${(piece.categorie === undefined) ? "Sans categorie" : piece.categorie}
    </p>
    `
        console.log(avis);
        if (avis !== null) {
            avis.forEach(avi => {
                pieceDiv.innerHTML = pieceDiv.innerHTML +
                    `
            <p>${avi.utilisateur}</p>
            <p>${avi.commentaire}</p>
            `
            })
        }
        fichesSection.appendChild(pieceDiv);
    }
}

async function getAvis(id) {
    try {
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        if (!reponse.ok) {
            throw new Error(`Erreur API : ${reponse.status}`);
        }
        const avis = await reponse.json();
        return avis;
    } catch (error) {
        console.log("API indisponible, fallback sur les avis vides :", error);
        return null;
    }
}

async function getPieces() {
    // Récupération des pièces depuis le fichier JSON
    //const reponse = await fetch("pieces-autos.json");
    try {
        const reponse = await fetch("http://localhost:8081/pieces");
        if (!reponse.ok) {
            throw new Error(`Erreur API : ${reponse.status}`);
        }
        const pieces = await reponse.json();
        return pieces;
    } catch (error) {
        console.log("API indisponible, fallback sur le JSON local :", error);

        const reponse = await fetch("pieces-autos.json");

        if (!reponse.ok) {
            throw new Error(`Erreur fichier JSON local : ${reponse.status}`);
        }

        const pieces = await reponse.json();

        return pieces;
    }
}
let pieces = await getPieces();
showFiltersForm();
showProducts(pieces);

