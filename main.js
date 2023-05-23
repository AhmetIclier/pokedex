"use strict";

let currentPokemon;

async function loadPokemon() {
    for (let i = 1; i<152; i++) {
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const pokemonData = await pokemon.json();
        document.getElementById('pokeContainer').innerHTML += renderCard(pokemonData, i)
        renderTypes(pokemonData, i)
    }
    
}

function renderCard(pokemonData, j) {
    return `
    <div class="miniCard ${renderBGColor(pokemonData)}" id="pokeCard(${j})" onclick="openCard(${pokemonData, j})">
        <div class="left">
            <h3>${renderName(pokemonData)}</h3>
            <div class="typeBox" id="typeBox${j}"></div>
        </div>
        <div class="right">
            <h4>#${renderPokeID(pokemonData)}</h4>
            <img src="${renderIMG(pokemonData)}"> 
        </div>
    </div>
`
}

function renderPokeID(pokemonData) {
    return pokemonData.id;
}

function renderBGColor(pokemonData) {
    return pokemonData['types']['0']['type']['name'];
}

function renderIMG(pokemonData) {
    return pokemonData['sprites']['other']['home']['front_default'];
}

function renderTypes(pokemonData, j) {
    for (let i = 0; i<pokemonData['types'].length; i++){
        document.getElementById(`typeBox${j}`).innerHTML += `<span class="tag">${pokemonData['types'][i]['type']['name']}</span><br>`;
    }
}

function renderName (pokemonData) {
    let name = pokemonData['name'];
    return name.charAt(0).toUpperCase() + name.slice(1);
}