"use strict";

let currentPokemon;

async function loadPokemon() {
    for (let i = 1; i<152; i++) {
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const pokemonData = await pokemon.json();
        document.getElementById('pokeContainer').innerHTML += renderCard(pokemonData, i);
        renderTypes(pokemonData, i)
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

function renderTypes(pokemonData, j) {
    for (let i = 0; i<pokemonData['types'].length; i++){
        document.getElementById(`typeBox${j}`).innerHTML += `<span class="tag">${pokemonData['types'][i]['type']['name']}</span><br>`;
    }
}

function renderName (pokemonData) {
    let name = pokemonData['name'];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function fetchCard(j) {
    let url = `https://pokeapi.co/api/v2/pokemon/${j}`
    let thisPokemon = await fetch(url);
    let pokemon = await thisPokemon.json();
    return pokemon;
}

function openCard(j) {
    const pokemon = fetchCard(j);
    const card = document.getElementById('openCard');
    
    //todo: generate card
    card.innerHTML += generateCardTop(pokemon);
    card.innerHTML += generateCardBottom(pokemon);
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

}


function toggleVisibility() {
    document.getElementById('openCard').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function close() {
    document.getElementById('openCard').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}