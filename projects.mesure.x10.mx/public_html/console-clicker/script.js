const console = document.getElementById('console');
const command = document.getElementById('command');
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
    console.appendChild(line);
}
function runCommand(command) {
    resetLine();
    addText('Error: ', 'darkred');
    addText('Unknown Command', 'red');
    sendLine();
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
        if (document.activeElement == document.getElementById('command')) {
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