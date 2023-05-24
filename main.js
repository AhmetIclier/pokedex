"use strict";

let currentPokemon;

async function loadPokemon() {
    for (let i = 1; i<152; i++) {
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const pokemonData = await pokemon.json();
        document.getElementById('pokeContainer').innerHTML += renderCard(pokemonData, i);
        renderMiniTypes(pokemonData, i)
    }
    
}

function renderCard(pokemonData, j) {
    return `
    <div class="miniCard ${renderBGColor(pokemonData)}" id="pokeCard(${j})" onclick="openCard(${j})">
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

function renderMiniTypes(pokemonData, j) {
    for (let i = 0; i<pokemonData['types'].length; i++){
        document.getElementById(`typeBox${j}`).innerHTML += `<span class="tag">${pokemonData['types'][i]['type']['name']}</span><br>`;
    }
}

function renderName (pokemonData) {
    let name = pokemonData['name'];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function openCard(j) {
    let url = `https://pokeapi.co/api/v2/pokemon/${j}`
    let thisPokemon = await fetch(url);
    let pokemon = await thisPokemon.json();
    viewCard(pokemon);
}

function viewCard(pokemonData) {
    const card = document.getElementById('openCard');
    
    //todo: generate card
    card.innerHTML = generateCardTop(pokemonData);
    card.innerHTML += generateCardBottom(pokemonData);
    toggleVisibility();
}

function generateCardTop(pokemon) {
    return `
    <div class="cardTop ${renderBGColor(pokemon)}">
        <div class="card-topline">
            <div class="cardleft">
                <button class="close" onclick="closeCard()">&times;</button>
            </div>
            <div class="cardright">${renderPokeID(pokemon)}</div>
        </div>
        <img src="${renderIMG(pokemon)}">
    </div>
    `
}

function generateCardBottom(pokemon) {
    return `
    <div class="cardBottom">
                <h2>${renderName(pokemon)}</h2>
                <div class="cardTags">
                    ${renderTypes(pokemon)}
                    
                </div>
                <div class="weight-n-height">
                    <div class="unit-container">
                        <div class="unit-value">${renderWeight(pokemon)} KG</div>
                        <div class="unit">Weight</div>
                    </div>
                    <div class="unit-container">
                        <div class="unit-value">${renderHeight(pokemon)} M</div>
                        <div class="unit">Height</div>
                    </div>
                </div>
                <div class="canvas-container">
                    <canvas id="stats" class="stats"></canvas>
                </div>
            </div>
    `
}

function renderWeight(pokemon) {
    return (pokemon['height'])/10
}
function renderHeight(pokemon) {
    return pokemon['height']/10;
}

function renderTypes(pokemon) {
    return `
        <div class="openCardTag ${renderTagColor(0, pokemon)}">${pokemon['types']['0']['type']['name']}</div>
        <div class="openCardTag ${renderTagColor(1, pokemon)}">${pokemon['types']['1']['type']['name']}</div>
    `
}

function renderTagColor(id, pokemon) {
    return pokemon['types'][id]['type']['name'];
}


function toggleVisibility() {
    document.getElementById('openCard').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeCard() {
    document.getElementById('openCard').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}