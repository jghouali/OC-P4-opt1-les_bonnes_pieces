// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

const filtresSection = document.querySelector(".filtres");
const fichesSection = document.querySelector(".fiches");

let filtresForm = document.createElement("form");
filtresForm.appendChild(document.createElement('input', 'type="checkbox"'));

filtresSection.appendChild(filtresForm);

console.log(pieces);
pieces.forEach(piece => {
    console.log(piece.nom);
    let pieceDiv = document.createElement("div");
    pieceDiv.innerHTML = `
    <img src="${piece.image}">
    <h2>${piece.nom}</h2
    <p>
    Description :<br>${piece.description ?? "Pas de description"}<br><br>
    ${piece.prix}€<br>
    ${piece.categorie}
    </p>
    `
    fichesSection.appendChild(pieceDiv);
});
console.log(pieces);

