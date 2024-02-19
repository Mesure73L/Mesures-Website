const console = document.getElementById('console');
const logs = document.getElementById('logs');
let command = document.getElementById('command');
let line = document.createElement('p');
let clicks = 0;
let ppc = 1;
let ppcprice = 10;
let cps = 0;
let cpsprice = 10;

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
function sendEmpty() {
    const p = document.createElement("p");
    const br = document.createElement('br');
    p.appendChild(br);
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
    const cmd = command.split(' ')
    if (cmd[0] == 'clear') {
        if (cmd[1] == 'confirm') {
            cmdclearconfirm();
        } else {
            cmdclear();
        }
    } else if (cmd[0] == 'shop') {
        cmdshop();
    } else if (cmd[0] == 'buy') {
        cmdbuy(cmd[1], cmd[2])
    } else {
        error('Unknown Command');
    }
}
function cmdclear() {
    resetLine();
    addText('Are you sure you want to clear the console? ', 'white');
    addText('This cannot be undone.', 'red');
    addText(' Run ', 'white');
    addText('clear confirm', 'lightblue');
    addText(' to confirm this choice.', 'white');
    sendLine();
}
function cmdclearconfirm() {
    clear();
}
function cmdshop() {
    sendEmpty();
    
    resetLine();
    addText('Clicks: ', 'lightblue');
    addText(clicks, 'blue');
    sendLine();

    sendEmpty();

    resetLine();
    addText('Points Per Click', 'lightgreen');
    sendLine();
    resetLine();
    addText('----------------', 'green');
    sendLine();

    resetLine();
    addText(`Owned: ${ppc}`, 'yellow');
    sendLine();
    
    resetLine();
    if (clicks >= ppcprice) {
        addText(`Price: ${ppcprice}`, 'green')
    } else {
        addText(`Price: ${ppcprice}`, 'red')
    }
    sendLine();

    sendEmpty();
    sendEmpty();

    resetLine();
    addText('Clicks Per Second', 'lightgreen');
    sendLine();
    resetLine();
    addText('-----------------', 'green');
    sendLine();

    resetLine();
    addText(`Owned: ${cps}`, 'yellow');
    sendLine();

    resetLine();
    if (clicks >= cpsprice) {
        addText(`Price: ${cpsprice}`, 'green')
    } else {
        addText(`Price: ${cpsprice}`, 'red')
    }
    sendLine();

    sendEmpty();

    resetLine();
    addText('To upgrade: ', 'white');
    addText('buy <type> <amount>', 'yellow');
    sendLine();

    sendEmpty();
}
function cmdbuy(type, amount) {
    let amt;
    if (amount == undefined) {
        amt = 1;
    } else {
        amt = parseInt(amount);
    }
    if (type == 'ppc') {
        if (amt > 0) {
            let failed = false;
            let tempprice = ppcprice;
            let tempclicks = clicks;
            let tempppc = ppc;
            for (i = 0; i < amt; i++) {
                if (tempclicks >= tempprice) {
                    tempclicks -= tempprice;
                    tempprice = Math.floor(tempprice * 1.2);
                    tempppc += 1;
                } else {
                    failed = true;
                }
            }
            if (failed) {
                error('Not enough clicks!');
            } else {
                ppcprice = tempprice;
                clicks = tempclicks;
                ppc = tempppc;
                resetLine();
                addText(`Bought ${amt} points per click!`, 'lightblue');
                sendLine();
            }
        } else {
            error('Cannot buy 0 or less!');
        }
    } else if (type == 'cps') {
        if (amt > 0) {
            let failed = false;
            let tempprice = cpsprice;
            let tempclicks = clicks;
            let tempcps = cps;
            for (i = 0; i < amt; i++) {
                if (tempclicks >= tempprice) {
                    tempclicks -= tempprice;
                    tempprice = Math.floor(tempprice * 1.2);
                    tempcps += 1;
                } else {
                    failed = true;
                }
            }
            if (failed) {
                error('Not enough clicks!');
            } else {
                cpsprice = tempprice;
                clicks = tempclicks;
                cps = tempcps;
                resetLine();
                addText(`Bought ${amt} clicks per second!`, 'lightblue');
                sendLine();
            }
        } else {
            error('Cannot buy 0 or less!');
        }
    }
}
function cpsClick() {
    clicks += cps;
    setTimeout('cpsClick()', 1000);
}
cpsClick();

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
        } else {
            clicks += ppc;
        }
    }
});

window.onload = function() {
    resetLine();
    addText('Loaded!', 'lightgreen');
    sendLine();
};