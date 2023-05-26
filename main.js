"use strict";
let currentGen = 0;
let nextGenCount = 151;
async function loadPokemon() {
    // document.getElementById('pokeContainer').innerHTML = '';
    for (let i = currentGen+1; i<nextGenCount+1; i++) {
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

// async function addNextGen() {

// }

function nextGen() {
    switch (nextGenCount) {
        case 151:
            currentGen = nextGenCount;
            nextGenCount = 251;
            loadPokemon();
            break;
        case 251:
            currentGen = nextGenCount;
            nextGenCount = 386;
            loadPokemon();
            break;
        case 386:
            currentGen = nextGenCount;
            nextGenCount = 493;
            loadPokemon();
            break;
        case 493:
            currentGen = nextGenCount;
            nextGenCount = 649;
            loadPokemon();
            break;
        case 649:
            currentGen = nextGenCount;
            nextGenCount = 721;
            loadPokemon();
            break;
        case 721:
            currentGen = nextGenCount;
            nextGenCount = 809;
            loadPokemon();
            break;
        case 809:
            currentGen = nextGenCount;
            nextGenCount = 1017;
            loadPokemon();
            break;
        case 1017:
            currentGen = nextGenCount;
            document.getElementById('nextGenButton').classList.add('d-none');
            break;
    }
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
    if (j < 2) {
        document.getElementById(`next-btn${j}`).classList.remove('d-none');
        document.getElementById(`prev-btn${j}`).classList.add('d-none');
    } else if (j == nextGenCount) {
        document.getElementById(`next-btn${j}`).classList.add('d-none');
        document.getElementById(`prev-btn${j}`).classList.remove('d-none');
    }
}

function viewCard(pokemonData) {
    const card = document.getElementById('openCard');
    card.innerHTML = generateCardTop(pokemonData);
    card.innerHTML += generateCardBottom(pokemonData);
    renderCanvas(pokemonData);
    toggleVisibility();
}

function next(id) {
    if (id === nextGenCount) {
        document.getElementById(`next-btn${id}`).classList.add('d-none');
    } else if ( id < nextGenCount) {
        openCard(id+1);
    }
}

function prev(id) {
    openCard(id-1);
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
        <div class="img-box">
            <div onclick="prev(${pokemon['id']})" class="btn-box" id="prev-btn${pokemon['id']}">
                <button>&lt;</button>
            </div>
            <img src="${renderIMG(pokemon)}">
            <div onclick="next(${pokemon['id']})" class="btn-box" id="next-btn${pokemon['id']}">
                <button>&gt;</button>
            </div>
        </div>
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