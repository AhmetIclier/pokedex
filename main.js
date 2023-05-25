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
    renderCanvas(pokemonData);
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
            <canvas id="stats${pokemon['id']}" width="270px" height="150px" class="stats"></canvas>
        </div>
    </div>
    `;
}

function renderCanvas(pokemon) {
    const canvas = document.getElementById(`stats${pokemon['id']}`);
    new Chart(canvas, {
        type: 'bar',
    data: {
        labels: ['HP', 'ATK', 'DEF', 'SP. ATK', 'SP. DEF', 'SPD'],
        datasets: [{
            labels: 'not needed',
            data:[
                pokemon['stats']['0']['base_stat'],
                pokemon['stats']['1']['base_stat'],
                pokemon['stats']['2']['base_stat'],
                pokemon['stats']['3']['base_stat'],
                pokemon['stats']['4']['base_stat'],
                pokemon['stats']['5']['base_stat']],
            borderWidth: 0,
            backgroundColor: [
                '#d43a49',
                '#fda827',
                '#0091ea',
                '#d0870b',
                '#026aaf',
                '#388e3a'
            ]
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'rgb(255, 99, 132)'
                }
            }
        },
        indexAxis: 'y'
    } 
    })
}

function renderWeight(pokemon) {
    return (pokemon['height'])/10
}
function renderHeight(pokemon) {
    return pokemon['height']/10;
}

function renderTypes(pokemon) {
    if (pokemon['types'].length === 1) {
        return `<div class="openCardTag ${pokemon['types'][0]['type']['name']}">
                    ${pokemon['types'][0]['type']['name']}
                </div>`
    } else if (pokemon['types'].length === 2) {
        return `<div class="openCardTag ${pokemon['types'][0]['type']['name']}">
                    ${pokemon['types'][0]['type']['name']}
                </div>
                <div class="openCardTag ${pokemon['types'][1]['type']['name']}">
                    ${pokemon['types'][1]['type']['name']}
                </div>`
    }
}


function toggleVisibility() {
    document.getElementById('openCard').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeCard() {
    document.getElementById('openCard').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}