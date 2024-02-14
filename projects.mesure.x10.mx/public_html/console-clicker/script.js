const console = document.getElementById('console');
const logs = document.getElementById('logs');
let command = document.getElementById('command');
let line = document.createElement('p');

function resetLine() {
    line = document.createElement('p');
}
function addText(textInput, colorInput) {
    const span = document.createElement("span");
    const text = document.createTextNode(textInput);
    span.style.color = colorInput;
    span.appendChild(text);
    line.appendChild(span);
}
function sendLine() {
    logs.appendChild(line);
    document.getElementById('last').remove();
    const p = document.createElement("p");
    const br = document.createElement('br');
    p.appendChild(br);
    p.id = 'last';
    logs.appendChild(p);
    var objDiv = document.getElementById("console");
    objDiv.scrollTop = objDiv.scrollHeight;
}
function error(message) {
    resetLine();
    addText('Error: ', 'darkred');
    addText(message, 'red');
    sendLine();
}
function clear() {
    logs.innerHTML = '<p id="last"><br></p>';
    resetLine();
    addText('The console was cleared.', 'white');
    sendLine();
}
function runCommand(command) {
    if (command == 'clear') {
        resetLine();
        addText('Are you sure you want to clear the console? ', 'white');
        addText('This cannot be undone.', 'red');
        addText(' Run ', 'white');
        addText('clear confirm', 'lightblue');
        addText(' to confirm this choice.', 'white');
        sendLine();
    } else if (command == 'clear confirm') {
        clear();
    } else {
        error('Unknown Command');
    }
}

resetLine();
addText('Loading ', 'lightgreen');
addText('Console Clicker ', 'yellow');
addText('v1.0.0', 'orange');
addText('...', 'lightgreen');
sendLine();

document.body.addEventListener("keypress", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        if (document.activeElement == document.getElementById('command') && /( +)?(?=[^ ])( +)?/.test(command.value)) {
            resetLine();
            addText(`> ${command.value}`, 'white');
            sendLine();
            runCommand(command.value);
            command.value = '';
        }
    }
});

window.onload = function() {
    resetLine();
    addText('Loaded!', 'lightgreen');
    sendLine();
};