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
const active = {};
let cman;
let highlightedYears = [],
    partialYears = [],
    monthsToHighlight = {},
    partialMonths = {};
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Fetching information.json
function ajax(url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = reject;
        xhr.open("GET", url);
        xhr.send();
    });
}

// Initializing the page
ajax(`./not-an-api/challenges/information.json?n=${crypto.randomUUID()}`)
    .then(function (result) {
        cman = new CookieManager(JSON.parse(result));
        // Steps to do after information.json loads
        initializeCookies();
        createDOMYears();
        highlightChallenges();
        initializeSettings();
        document.getElementById("noJavaScript").classList.add("noDisplay");
    })
    .catch(function (err) {
        // Logging any errors with initialization to the console
        console.error(err);
    });

// Initializing the cookies
function initializeCookies() {
    if (cman.completed === "") {
        cman.completed = cman.blankCookie;
    } else {
        cman.completed = cman.completed;
    }

    if (cman.user === "") {
        cman.user = cman.blankUserCokie;
    } else {
        cman.user = cman.user;
    }
}

// Year Selection
function yearSelect(year) {
    const yearElement = document.getElementById(`syear-${year}`);
    // If the selected year is released,
    if (!yearElement.hasAttribute("data-unreleased")) {
        // Hide all year notes
        Array.from(document.getElementsByClassName("syearnote")).forEach((element) => {
            element.classList.add("noDisplay");
        });
        // If the user clicked on the active year, hide everything
        if (year == active.year) {
            document.getElementById("select-month").classList.add("noDisplay");
            document.getElementById("select-challenge").classList.add("noDisplay");
            document.getElementById("challenge").classList.add("noDisplay");
            yearElement.classList.remove("select-active");
            active.year = undefined;
            active.month = undefined;
            active.challenge = undefined;
        } else {
            // Otherwise, make the previous active year not active anymore
            if (active.year) {
                document.getElementById(`syear-${active.year}`).classList.remove("select-active");
            }
            // Then, make the new year active
            document.getElementById(`syear-${year}`).classList.add("select-active");
            // Unhide the month selector
            document.getElementById("select-month").classList.remove("noDisplay");
            // activeMonths is an array of the months that should be shown for the chosen year
            let activeMonths = cman.information[year].months;
            for (let i = 0; i < months.length; i++) {
                // For every month, hide it, and remove select-active if it has it
                document.getElementById(`smonth-${months[i]}`).classList.add("noDisplay");
                document.getElementById(`smonth-${months[i]}`).classList.remove("select-active");
            }
            for (let i = 1; i <= 3; i++) {
                // For every challenge, if it has select-active, remove it.
                document.getElementById(`schallenge-${i.toString()}`).classList.remove("select-active");
            }
            for (let i = 0; i < activeMonths.length; i++) {
                const currentMonth = document.getElementById(`smonth-${activeMonths[i]}`);
                // For every active month, show it. Then, if it is unreleased, give it data-unreleased. Otherwise, remove data-unreleased if it has it.
                currentMonth.classList.remove("noDisplay");
                if (cman.information[year][activeMonths[i]].overall == false) {
                    currentMonth.setAttribute("data-unreleased", "");
                } else {
                    currentMonth.removeAttribute("data-unreleased");
                }
                // Highlighting Completed/In Progress Months
                if (monthsToHighlight[year]) {
                    // If monthsToHighlight includes the current year,
                    if (monthsToHighlight[year].includes(activeMonths[i])) {
                        // Then, if it includes the current active month, add completed.
                        currentMonth.classList.add("completed");
                    } else {
                        // Otherwise, remove completed
                        currentMonth.classList.remove("completed");
                    }
                }
                if (partialMonths[year]) {
                    // If partialMonths includes the current year,
                    if (partialMonths[year].includes(activeMonths[i])) {
                        // Then, if it includes the current active month, add in-progress.
                        currentMonth.classList.add("in-progress");
                    } else {
                        // Otherwise, remove in-progress.
                        currentMonth.classList.remove("in-progres");
                    }
                }
            }
            // If the current year has a note, then show it
            if (document.getElementById(`syearnote-${year}`)) {
                document.getElementById(`syearnote-${year}`).classList.remove("noDisplay");
            }
            // Make the active year the selected year.
            active.year = year;
            // Make the active challenge and active month not active anymore.
            active.month = undefined;
            active.challenge = undefined;
            // Hide the challenge selector.
            document.getElementById("select-challenge").classList.add("noDisplay");
        }
    }
}

// Month Selection
function monthSelect(month) {
    const monthElement = document.getElementById(`smonth-${month}`);
    // If the selected month is released,
    if (!monthElement.hasAttribute("data-unreleased")) {
        // If the month that was clicked on is the active month, hide everything.
        if (month == active.month) {
            document.getElementById("select-challenge").classList.add("noDisplay");
            document.getElementById("challenge").classList.add("noDisplay");
            monthElement.classList.remove("select-active");
            active.month = undefined;
        } else {
            // Otherwise, if there is an active month, then make it not active anymore.
            if (active.month) {
                document.getElementById(`smonth-${active.month}`).classList.remove("select-active");
            }
            // Then, make the selected month active.
            document.getElementById(`smonth-${month}`).classList.add("select-active");
            // Unhide the challenge selector.
            document.getElementById("select-challenge").classList.remove("noDisplay");
            // Make the active month the selected month.
            active.month = month;
            // Make the active challenge not active anymore.
            active.challenge = undefined;
        }
        for (let j = 1; j <= 3; j++) {
            if (cman.information[active.year][month][j.toString()] == false) {
                // For every challenge, if it is unreleased, give it data-unreleased.
                document.getElementById("schallenge-" + j.toString()).setAttribute("data-unreleased", "");
                // Then, if it has select-active, remove select-active.
                document.getElementById("schallenge-" + j.toString()).classList.remove("select-active");
            }
            if (cman.completed[active.year]) {
                if (cman.completed[active.year][month]) {
                    if (cman.completed[active.year][month][j.toString()]) {
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
        if (challenge == active.challenge) {
            document.getElementById("challenge").classList.add("noDisplay");
            document.getElementById(`schallenge-${challenge}`).classList.remove("select-active");
            active.challenge = undefined;
        } else {
            if (active.challenge) {
                document.getElementById(`schallenge-${active.challenge}`).classList.remove("select-active");
            }
            document.getElementById(`schallenge-${challenge}`).classList.add("select-active");
            document.getElementById("challenge").classList.remove("noDisplay");
            active.challenge = `${challenge}`;
            fetch(`https://mesure.x10.mx/twelve-of-code/not-an-api/challenges/${active.year}/${active.month}/${active.challenge}.html`)
                .then((res) => res.text())
                .then((text) => {
                    document.getElementById("challenge").innerHTML = text;
                });
        }
    }
}

function createDOMYears() {
    const yearContainer = document.getElementById("select-year");
    const noteContainer = document.getElementById("notes");

    for (const year in cman.information) {
        const yearElement = document.createElement("tr");
        yearElement.id = "syear-" + year;
        yearContainer.appendChild(yearElement);
        const yearText = document.createElement("td");
        yearText.innerText = year;
        if ("note" in cman.information[year]) {
            if ("title" in cman.information[year].note) {
                yearText.innerText += ` (${cman.information[year].note.title})`;
            }
            if ("description" in cman.information[year].note) {
                const descriptionElement = document.createElement("div");
                descriptionElement.classList.add("syearnote");
                descriptionElement.classList.add("noDisplay");
                descriptionElement.id = "syearnote-" + year;
                noteContainer.appendChild(descriptionElement);
                descriptionElement.appendChild(document.createElement("br"));
                const descriptionText = document.createElement("p");
                descriptionText.classList.add("blue");
                descriptionText.innerText = cman.information[year].note.description;
                descriptionElement.appendChild(descriptionText);
            }
        }
        yearElement.appendChild(yearText);
        yearElement.addEventListener("click", () => {
            yearSelect(year);
        });
        if (cman.information[year].overall == false) {
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
    for (const year in cman.completed) {
        let yearCount = 0;
        let partial = false;
        const yearCookieObj = cman.completed[year];
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
                if (monthsToHighlight[year]) {
                    monthsToHighlight[year].push(month);
                } else {
                    monthsToHighlight[year] = [month];
                }
            } else if (partialMonth) {
                if (partialMonths[year]) {
                    partialMonths[year].push(month);
                } else {
                    partialMonths[year] = [month];
                }
            }
        }
        if (yearCount === cman.information[year].months.length) {
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
const noDoubleElements = document.getElementsByClassName("noDouble");
for (let i = 0; i < noDoubleElements.length; i++) {
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

function initializeSettings() {
    let username = cman.user.username;
    let seed = cman.user.seed;
    document.getElementById("settings").addEventListener("click", () => {
        document.getElementById("editSettings").classList.toggle("noDisplay");
        document.getElementById("input-username").value = username;
        document.getElementById("input-seed").value = seed;
        editData();
    });

    document.getElementById("input-username").addEventListener("change", () => {
        username = document.getElementById("input-username").value;
        cman.user = { username: username, seed: seed };
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
            cman.user = { username: username, seed: seed };
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
}
function editData() {
    let content = btoa(JSON.stringify({ completed: cman.completed, user: cman.user }));
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
