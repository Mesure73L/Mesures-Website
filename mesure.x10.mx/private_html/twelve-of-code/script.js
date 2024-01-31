/*
- 
- TWELVE OF CODE
- --------------
- 
- Twelve of Code ©️ 2024 by Mesure73L is licensed under CC BY-NC-SA 4.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
- Source code is available at https://github.com/Mesure73L/My-Website/tree/main.
- 
- Thank you for your understanding.
- 
*/
const active = {};
let a;
let cman;
let yearsToHighlight = [],
    partialYears = [],
    monthsToHighlight = {},
    partialMonths = {};
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const ErrorToast = Swal.mixin({
    icon: "error",
    confirmButtonText: "Continue",
    confirmButtonColor: "#009eff",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
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
        Array.from(document.getElementsByClassName("noJavaScript")).forEach(element => {
            element.classList.add("noDisplay");
        });
        document.getElementById("select-year").classList.remove("noDisplay");
    })
    .catch(function (e) {
        // Logging any errors with initialization to the console
        console.error("There was an error during initialization.", e);
    });

// Initializing the cookies
function initializeCookies() {
    if (cman.completed == "") {
        cman.completed = cman.blankCookie;
    } else {
        cman.completed = cman.completed;
    }
    if (cman.user == "") {
        cman.user = cman.blankUserCookie;
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
        Array.from(document.getElementsByClassName("syearnote")).forEach(element => {
            element.classList.add("noDisplay");
        });
        // If the user clicked on the active year, hide everything
        if (year == active.year) {
            if (active.month != undefined) {
                monthSelect(active.month);
            }
            yearElement.classList.remove("select-active");
            active.year = undefined;
            document.getElementById("select-month").classList.add("noDisplay");
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
            if (active.challenge != undefined) {
                challengeSelect(active.challenge);
            }
            monthElement.classList.remove("select-active");
            document.getElementById("select-challenge").classList.add("noDisplay");
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
                // If the completed cookie includes the current year,
                if (cman.completed[active.year][month]) {
                    // Then, if the completed cookie includes the current month,
                    if (cman.completed[active.year][month][j.toString()]) {
                        // Then, if the current challenge is completed, add the completed class.
                        document.getElementById("schallenge-" + j.toString()).classList.add("completed");
                    } else {
                        // Otherwise, remove the completed class if it has it.
                        document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
                    }
                    // If the completed cookie does not include the current month, the remove the completed class if it has it.
                } else {
                    document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
                }
                // Otherwise, if the completed cookie does not include the current year, then remove the completed class if it has it.
            } else {
                document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
            }
        }
    }
}

// Challenge Selection
function challengeSelect(challenge) {
    const challengeElement = document.getElementById(`schallenge-${challenge}`);
    // If the challenge is released,
    if (!challengeElement.hasAttribute("data-unreleased")) {
        // Then, if the challenge that was clicked is the active challenge, then hide everything.
        if (challenge == active.challenge) {
            document.getElementById("challenge").classList.add("noDisplay");
            document.getElementById(`schallenge-${challenge}`).classList.remove("select-active");
            active.challenge = undefined;
        } else {
            // Otherwise, if there is an active challenge, remove select-active from it.
            if (active.challenge) {
                document.getElementById(`schallenge-${active.challenge}`).classList.remove("select-active");
            }
            // Then, give the newly selected challenge select-active.
            document.getElementById(`schallenge-${challenge}`).classList.add("select-active");
            // Unhide the challlenge.
            document.getElementById("challenge").classList.remove("noDisplay");
            // Then, set the active challenge to the current challenge.
            active.challenge = challenge;
            fetch(`./not-an-api/challenges/${active.year}/${active.month}/${active.challenge}.html`)
                .then(res => res.text())
                .then(text => {
                    // Next, set the contents of the challenge element to the challenge specified at the challenge page for the selected challenge.
                    document.getElementById("challenge").innerHTML = text;
                    const F = new Function(
                        document.getElementById(
                            "challenge-javascript"
                        ).innerText
                    );
                    F();
                });
        }
    }
}

// Function for creating the year elements from information.json
function createDOMYears() {
    const yearContainer = document.getElementById("select-year");
    const noteContainer = document.getElementById("notes");
    // For every year in information.json,
    for (const year in cman.information) {
        // Create a year element, with a title and description if there is one.
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
        // Add an event listener to call yearSelect() when it is clicked.
        yearElement.addEventListener("click", () => {
            yearSelect(year);
        });
        // If the year is unreleased, give it data-unreleased.
        if (cman.information[year].overall == false) {
            yearElement.setAttribute("data-unreleased", "");
        }
    }
}
// Add event listeners to all the months and challenges.
months.forEach(month => {
    document.getElementById("smonth-" + month).addEventListener("click", () => {
        monthSelect(month);
    });
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
    // For each year, count the number of challenges.
    for (const year in cman.completed) {
        let yearCount = 0;
        let partial = false;
        const yearCookieObj = cman.completed[year];
        for (const month in yearCookieObj) {
            // For each month,
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
            // If all 3 challenges are completed, append it to monthsToHighlight.
            if (monthCount === 3) {
                yearCount++;
                if (monthsToHighlight[year]) {
                    monthsToHighlight[year].push(month);
                } else {
                    monthsToHighlight[year] = [month];
                }
                // Otherwise, if not all 3 challenges are completed, but at least one is, append it to partialMonths.
            } else if (partialMonth) {
                if (partialMonths[year]) {
                    partialMonths[year].push(month);
                } else {
                    partialMonths[year] = [month];
                }
            }
        }
        // For each year, if all months are completed, append it to yearsToHighlight.
        if (yearCount === cman.information[year].months.length) {
            yearsToHighlight.push(year);
        } else if (partial) {
            // Otherwise, if not all months are completed, but at least one is, append it to partialYears.
            partialYears.push(year);
        }
    }
    // For each year that is in yearsToHighlight, add completed to it.
    for (let i = 0; i < yearsToHighlight.length; i++) {
        const yearElmt = document.getElementById("syear-" + yearsToHighlight[i]);
        yearElmt.classList.add("completed");
    }
    // For each year that is in partialYears, add in-progress to it.
    for (let i = 0; i < partialYears.length; i++) {
        const yearElmt = document.getElementById("syear-" + partialYears[i]);
        yearElmt.classList.add("in-progress");
    }
}

// Preventing Double Click on elements with class noDouble
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
    const settingsButton = document.getElementById("settings");
    const settingsElement = document.getElementById("editSettings");
    const usernameInput = document.getElementById("input-username");
    const seedInput = document.getElementById("input-seed");

    settingsButton.addEventListener("click", () => {
        settingsElement.classList.toggle("noDisplay");
        if (!cman.user.username) {
            cman.user.username = `User-${cman.random(1000000000, 9999999999)}`;
        }
        if (!cman.user.seed) {
            const userCookie = cman.user;
            userCookie.seed = cman.random(1000000000, 9999999999);
            cman.user = userCookie;
        }
        usernameInput.value = cman.user.username;
        seedInput.value = cman.user.seed;
    });
    usernameInput.addEventListener("change", () => {
        const userCookie = cman.user;
        userCookie.username = usernameInput.value;
        cman.user = userCookie;
    });
    seedInput.addEventListener("change", () => {
        if (/^[1-9]\d{9}$/.test(seedInput.value)) {
            const userCookie = cman.user;
            userCookie.seed = Number(seedInput.value);
            cman.user = userCookie;
        } else {
            seedInput.value = cman.user.seed;
        }
    });
}
