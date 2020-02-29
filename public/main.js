// Make connection
const socket = io.connect('http://localhost:4000');

// Query DOM
const output = document.getElementById('output');
let answers;
let packs;
let packsCounter = 0;
let reactionsCounter = 0;
let currentReaction;
let currentReactionId;
let currentPack;
let currentPackId;

fetch('http://localhost:4000/answers').then((result) => result.json()).then((json) => answers = json);
fetch('http://localhost:4000/reactions').then((result) => result.json()).then((json) => packs = json);

function getCurrentReaction() {
    currentPack = packs[packsCounter];
    currentPackId = currentPack.id;
    const reactionsFromPack = JSON.parse(currentPack.reactions_ids);
    currentReactionId = reactionsFromPack[reactionsCounter];
    fetch(`http://localhost:4000/reactions/${currentReactionId}`).then((result) => result.json()).then((json) => {
        currentReaction=json[0];
        printReaction();
    });

    if (reactionsCounter < 5) {
        reactionsCounter++
    } else {
        output.innerHTML = '<p>' + '¡Valora tu experiencia!'+ '</p>';
        reactionsCounter = 0;
        if (packsCounter < packs.length) {
            packsCounter++
        } else {
            packsCounter = 0;
        }
    } 
}

function printReaction() {
    output.innerHTML = '<p>' + currentReaction.text+ '</p>';
}

socket.on('output', function(data) {
    if (data.event === 'buttonClicked') {
        getCurrentReaction();
    }
}
);

