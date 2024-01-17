/*
- 
- TWELVE OF CODE
- --------------
- 
- Twelve of Code © 2024 by Mesure73L is licensed under CC BY-NC-SA 4.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
- Source code is available at https://github.com/Mesure73L/My-Website/tree/main.
- 
- Thank you for your understanding.
- 
*/

let syearActive,
    smonthActive,
    schallengeActive,
    info,
    cookieToSet,
    highlightedYears = [],
    partialYears = [],
    highlightedMonths = {},
    partialMonths = {};
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const completedChallenges = getCookie("completed");

document.getElementById("select-year").classList.remove("noDisplay");
document.getElementById("noJavaScript").classList.add("noDisplay");

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ajax

function ajax(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = reject;
        xhr.open("GET", url);
        xhr.send();
    });
}

ajax(`./not-an-api/challenges/information.json?n=${crypto.randomUUID()}`)
    .then(function (result) {
        info = JSON.parse(result);
        createDOMYears();
        highlightChallenges();
    })
    .catch(function (err) {
        console.error(err);
    });

// Cookies

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + btoa(JSON.stringify(cvalue)) + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(atob(c.substring(name.length, c.length)));
        }
    }
    return "";
}
cookieToSet = {
    2023: {dec: {1: false, 2: false, 3: false}},
    2024: {may: {1: false, 2: false, 3: false}, aug: {1: false, 2: false, 3: false}},
};
if (getCookie("completed") == "") {
    setCookie("completed", cookieToSet, 60);
} else {
    setCookie("completed", getCookie("completed"), 60);
}

cookieToSet = {username: `User-${random(1000000000, 9999999999)}`, seed: random(1000000000, 9999999999)};
if (getCookie("user") == "") {
    setCookie("user", cookieToSet, 60);
} else {
    setCookie("user", getCookie("user"), 60);
}

// Date Selection

function yearSelect(year) {
    if (!document.getElementById(`syear-${year}`).hasAttribute("data-unreleased")) {
        Array.from(document.getElementsByClassName("syearnote")).forEach(element => {
            element.classList.add("noDisplay");
        });
        if (year == syearActive) {
            document.getElementById("select-month").classList.add("noDisplay");
            document.getElementById("select-challenge").classList.add("noDisplay");
            document.getElementById("challenge").classList.add("noDisplay");
            document.getElementById(`syear-${year}`).classList.remove("select-active");
            syearActive = null;
        } else {
            if (syearActive) {
                document.getElementById(`syear-${syearActive}`).classList.remove("select-active");
            }
            document.getElementById(`syear-${year}`).classList.add("select-active");
            document.getElementById("select-month").classList.remove("noDisplay");
            let activeMonths = info[year].months;
            for (i = 0; i < months.length; i++) {
                document.getElementById(`smonth-${months[i]}`).classList.add("noDisplay");
                if (document.getElementById(`smonth-${months[i]}`).classList.contains("select-active")) {
                    document.getElementById(`smonth-${months[i]}`).classList.remove("select-active");
                }
            }
            for (i = 0; i < activeMonths.length; i++) {
                document.getElementById(`smonth-${activeMonths[i]}`).classList.remove("noDisplay");
                if (info[year][activeMonths[i]].overall == false) {
                    document.getElementById(`smonth-${activeMonths[i]}`).setAttribute("data-unreleased", "");
                } else {
                    if (document.getElementById(`smonth-${activeMonths[i]}`).hasAttribute("data-unreleased")) {
                        document.getElementById(`smonth-${activeMonths[i]}`).removeAttribute("data-unreleased");
                    }
                }
                const currentMonth = document.getElementById(`smonth-${activeMonths[i]}`);
                // Highlighting Completed/In Progress Months
                if (highlightedMonths[year]) {
                    if (highlightedMonths[year].includes(activeMonths[i])) {
                        currentMonth.classList.add("completed");
                        if (currentMonth.classList.contains("in-progress")) {
                            currentMonth.classList.remove("in-progress");
                        }
                    } else if (currentMonth.classList.contains("completed")) {
                        currentMonth.classList.remove("completed");
                    } else if (currentMonth.classList.contains("in-progress")) {
                        currentMonth.classList.remove("in-progres");
                    }
                }
                if (partialMonths[year]) {
                    if (partialMonths[year].includes(activeMonths[i])) {
                        currentMonth.classList.add("in-progress");
                        if (currentMonth.classList.contains("completed")) {
                            currentMonth.classList.remove("completed");
                        }
                    } else if (currentMonth.classList.contains("completed")) {
                        currentMonth.classList.remove("completed");
                    } else if (currentMonth.classList.contains("in-progress")) {
                        currentMonth.classList.remove("in-progres");
                    }
                }
                if (!(highlightedMonths[year] || partialMonths[year])) {
                    console.log(currentMonth);
                    if (currentMonth.classList.contains("completed")) {
                        currentMonth.classList.remove("completed");
                    }
                    if (currentMonth.classList.contains("in-progress")) {
                        currentMonth.classList.remove("in-progress");
                    }
                }
            }
            if (document.getElementById(`syearnote-${year}`)) {
                document.getElementById(`syearnote-${year}`).classList.remove("noDisplay");
            }
            syearActive = `${year}`;
            document.getElementById("select-challenge").classList.add("noDisplay");
        }
    }
}

function monthSelect(month) {
    if (!document.getElementById(`smonth-${month}`).hasAttribute("data-unreleased")) {
        if (month == smonthActive) {
            document.getElementById("select-challenge").classList.add("noDisplay");
            document.getElementById("challenge").classList.add("noDisplay");
            document.getElementById(`smonth-${month}`).classList.remove("select-active");
            smonthActive = null;
        } else {
            if (smonthActive) {
                document.getElementById(`smonth-${smonthActive}`).classList.remove("select-active");
            }
            document.getElementById(`smonth-${month}`).classList.add("select-active");
            document.getElementById("select-challenge").classList.remove("noDisplay");
            smonthActive = `${month}`;
        }
        if (schallengeActive) {
            challengeSelect(schallengeActive);
        }
        for (let j = 1; j <= 3; j++) {
            if (info[syearActive][month][j.toString()] == false) {
                document.getElementById("schallenge-" + j.toString()).setAttribute("data-unreleased", "");
            }
            if (completedChallenges[syearActive]) {
                if (completedChallenges[syearActive][month]) {
                    if (completedChallenges[syearActive][month][j.toString()]) {
                        document.getElementById("schallenge-" + j.toString()).classList.add("completed");
                    } else {
                        document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
                    }
                } else {
                    document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
                }
            } else {
                document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
            }
        }
    }
}

function challengeSelect(challenge) {
    if (!document.getElementById(`schallenge-${challenge}`).hasAttribute("data-unreleased")) {
        if (challenge == schallengeActive) {
            document.getElementById("challenge").classList.add("noDisplay");
            document.getElementById(`schallenge-${challenge}`).classList.remove("select-active");
            schallengeActive = null;
        } else {
            if (schallengeActive) {
                document.getElementById(`schallenge-${schallengeActive}`).classList.remove("select-active");
            }
            document.getElementById(`schallenge-${challenge}`).classList.add("select-active");
            document.getElementById("challenge").classList.remove("noDisplay");
            schallengeActive = `${challenge}`;
            fetch(`https://mesure.x10.mx/twelve-of-code/not-an-api/challenges/${syearActive}/${smonthActive}/${schallengeActive}.html`)
                .then(res => res.text())
                .then(text => {
                    document.getElementById("challenge").innerHTML = text;
                });
        }
    }
}

function createDOMYears() {
    const yearContainer = document.getElementById("select-year");
    const noteContainer = document.getElementById("notes");

    for (const year in info) {
        const yearElement = document.createElement("tr");
        yearElement.id = "syear-" + year;
        yearContainer.appendChild(yearElement);
        const yearText = document.createElement("td");
        yearText.innerText = year;
        if ("note" in info[year]) {
            if ("title" in info[year].note) {
                yearText.innerText += ` (${info[year].note.title})`;
            }
            if ("description" in info[year].note) {
                const descriptionElement = document.createElement("div");
                descriptionElement.classList.add("syearnote");
                descriptionElement.classList.add("noDisplay");
                descriptionElement.id = "syearnote-" + year;
                noteContainer.appendChild(descriptionElement);
                descriptionElement.appendChild(document.createElement("br"));
                const descriptionText = document.createElement("p");
                descriptionText.classList.add("blue");
                descriptionText.innerText = info[year].note.description;
                descriptionElement.appendChild(descriptionText);
            }
        }
        yearElement.appendChild(yearText);
        yearElement.addEventListener("click", () => {
            yearSelect(year);
        });
        if (info[year].overall == false) {
            yearElement.setAttribute("data-unreleased", "");
        }
    }
}

document.getElementById("smonth-jan").addEventListener("click", () => {
    monthSelect("jan");
});
document.getElementById("smonth-feb").addEventListener("click", () => {
    monthSelect("feb");
});
document.getElementById("smonth-mar").addEventListener("click", () => {
    monthSelect("mar");
});
document.getElementById("smonth-apr").addEventListener("click", () => {
    monthSelect("apr");
});
document.getElementById("smonth-may").addEventListener("click", () => {
    monthSelect("may");
});
document.getElementById("smonth-jun").addEventListener("click", () => {
    monthSelect("jun");
});
document.getElementById("smonth-jul").addEventListener("click", () => {
    monthSelect("jul");
});
document.getElementById("smonth-aug").addEventListener("click", () => {
    monthSelect("aug");
});
document.getElementById("smonth-sep").addEventListener("click", () => {
    monthSelect("sep");
});
document.getElementById("smonth-oct").addEventListener("click", () => {
    monthSelect("oct");
});
document.getElementById("smonth-nov").addEventListener("click", () => {
    monthSelect("nov");
});
document.getElementById("smonth-dec").addEventListener("click", () => {
    monthSelect("dec");
});

document.getElementById("schallenge-1").addEventListener("click", () => {
    challengeSelect("1");
});
document.getElementById("schallenge-2").addEventListener("click", () => {
    challengeSelect("2");
});
document.getElementById("schallenge-3").addEventListener("click", () => {
    challengeSelect("3");
});

// Highlighting Completed Challenges
function highlightChallenges() {
    for (const year in completedChallenges) {
        let yearCount = 0;
        let partial = false;
        const yearCookieObj = completedChallenges[year];
        for (const month in yearCookieObj) {
            let monthCount = 0;
            let partialMonth = false;
            const monthCookieObj = yearCookieObj[month];
            for (const challenge in monthCookieObj) {
                challengeValue = monthCookieObj[challenge];
                if (challengeValue) {
                    monthCount++;
                    partial = true;
                    partialMonth = true;
                }
            }
            if (monthCount === 3) {
                yearCount++;
                if (highlightedMonths[year]) {
                    highlightedMonths[year].push(month);
                } else {
                    highlightedMonths[year] = [month];
                }
            } else if (partialMonth) {
                if (partialMonths[year]) {
                    partialMonths[year].push(month);
                } else {
                    partialMonths[year] = [month];
                }
            }
        }
        if (yearCount === info[year].months.length) {
            highlightedYears.push(year);
        } else if (partial) {
            partialYears.push(year);
        }
    }
    // Highlighting Completed/In Progress Years
    for (let i = 0; i < highlightedYears.length; i++) {
        const yearElmt = document.getElementById("syear-" + highlightedYears[i]);
        yearElmt.classList.add("completed");
    }
    for (let i = 0; i < partialYears.length; i++) {
        const yearElmt = document.getElementById("syear-" + partialYears[i]);
        yearElmt.classList.add("in-progress");
    }
}

// Preventing Double Click

var noDoubleElements = document.getElementsByClassName("noDouble");

for (var i = 0; i < noDoubleElements.length; i++) {
    noDoubleElements[i].addEventListener(
        "mousedown",
        function (event) {
            if (event.detail > 1) {
                event.preventDefault();
            }
        },
        false
    );
}

// Settings

let username = getCookie("user")["username"];
let seed = getCookie("user")["seed"];

document.getElementById("settings").addEventListener("click", () => {
    document.getElementById("editSettings").classList.toggle("noDisplay");
    document.getElementById("input-username").value = username;
    document.getElementById("input-seed").value = seed;
    editData();
});

document.getElementById("input-username").addEventListener("change", () => {
    username = document.getElementById("input-username").value;
    setCookie("user", {username: username, seed: seed}, 60);
    document.getElementById("message-username").classList.add("green");
    document.getElementById("musername-br").classList.remove("noDisplay");
    document.getElementById("message-username").innerText = "Username updated!";
    setTimeout('document.getElementById("message-username").innerText = "";', 5000);
    setTimeout('document.getElementById("message-username").classList.remove("green");', 5000);
    setTimeout('document.getElementById("musername-br").classList.add("noDisplay");', 5000);
    editData();
});

document.getElementById("input-seed").addEventListener("change", () => {
    if (/[1-9]\d{9}/.test(document.getElementById("input-seed").value)) {
        seed = document.getElementById("input-seed").value;
        setCookie("user", {username: username, seed: seed}, 60);
        document.getElementById("message-seed").classList.add("green");
        document.getElementById("mseed-br").classList.remove("noDisplay");
        document.getElementById("message-seed").innerText = "Seed updated!";
        setTimeout('document.getElementById("message-seed").innerText = "";', 5000);
        setTimeout('document.getElementById("message-seed").classList.remove("green");', 5000);
        setTimeout('document.getElementById("mseed-br").classList.add("noDisplay");', 5000);
    } else {
        document.getElementById("message-seed").classList.add("red");
        document.getElementById("mseed-br").classList.remove("noDisplay");
        document.getElementById("message-seed").innerText = "Invalid seed!";
        document.getElementById("input-seed").value = seed;
        setTimeout('document.getElementById("message-seed").innerText = "";', 5000);
        setTimeout('document.getElementById("message-seed").classList.remove("red");', 5000);
        setTimeout('document.getElementById("mseed-br").classList.add("noDisplay");', 5000);
    }
    editData();
});

function editData() {
    let content = btoa(JSON.stringify({completed: getCookie("completed"), user: getCookie("user")}));
    document.getElementById("data").value = content;
}

/*let previousData = btoa(JSON.stringify({'completed': getCookie('completed'), 'user': getCookie('user')}));

document.getElementById('data').addEventListener('click', () => {
    let content = JSON.parse(atob(document.getElementById('data').value));
    try {
        setCookie('completed', content['completed'], 60);
        setCookie('user', content['user'], 60);
        let username = getCookie('user')['username']
        let seed = getCookie('user')['seed'];
        document.getElementById('input-username').value = username;
        document.getElementById('input-seed').value = seed;
        previousData = btoa(JSON.stringify({'completed': getCookie('completed'), 'user': getCookie('user')}));
    } catch {
        document.getElementById('data').value = previousData;
    }
});*/