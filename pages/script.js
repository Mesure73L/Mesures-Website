/*
-
- TWELVE OF CODE
- --------------
-
- Twelve of Code ©️ 2024 by Mesure73L is licensed under CC BY-NC-SA 4.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
- Source code is available at https://github.com/Mesure73L/mesure.x10.mx/tree/main.
-
- Thank you for your understanding.
-
*/
const a = "as";
const active = {pack: {manifest: "http://localhost:8000/challenges/manifest.json"}};
let cman;
let hashChange = true;
let yearsToHighlight = [],
    partialYears = [],
    monthsToHighlight = {},
    partialMonths = {};
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const ErrorToast = Swal.mixin({
    icon: "error",
    toast: true,
    position: "top-end",
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
let dataInputUUID;

Array.from(document.getElementsByClassName("hvr-bob")).forEach(element => {
    element.addEventListener("mouseout", () => {
        element.classList.add("hovered");
    });
});

// Handle messages from challenge iframes
window.addEventListener("message", event => {
    switch (event.data.request) {
        case "seed":
            event.source.postMessage({response: "seed", value: cman.user.seed});
            break;
    }
});

// Fetching manifest.json
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
new ajax(`${active.pack.manifest}?n=${crypto.randomUUID()}`)
    .then(result => {
        cman = new CookieManager(JSON.parse(result));
        // Steps to do after information.json loads
        active.pack.url = cman.information.metadata.url;
        initializeCookies();
        createDOMYears();
        highlightChallenges();
        initializeSettings();
        Array.from(document.getElementsByClassName("noJavaScript")).forEach(element => {
            element.classList.add("noDisplay");
        });
        document.getElementById("select-year").classList.remove("noDisplay");
        navigateURL();
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

// See what challenge the user wants to skip to
function navigateURL() {
    const hash = window.location.hash.slice(1).split("-");
    if (active.year) {
        yearSelect(active.year, false);
    }
    if (active.month) {
        monthSelect(active.month, false);
    }
    if (active.challenge) {
        challengeSelect(active.challenge, false);
    }
    const yearElement = document.getElementById(`syear-${hash[0]}`);
    const monthElement = document.getElementById(`smonth-${hash[1]}`);
    const challengeElement = document.getElementById(`schallenge-${hash[2]}`);
    if (/^\d{4}$/.exec(hash[0]) && !yearElement.hasAttribute("data-unreleased")) {
        yearSelect(hash[0], false);
        if (
            /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$/.exec(hash[1]) &&
            !monthElement.hasAttribute("data-unreleased")
        ) {
            monthSelect(hash[1], false);
            if (/^[1-3]$/.exec(hash[2]) && !challengeElement.hasAttribute("data-unreleased")) {
                challengeSelect(hash[2], false);
            } else {
                window.location.hash = `#${hash[0]}-${hash[1]}`;
            }
        } else {
            window.location.hash = `#${hash[0]}`;
        }
    } else {
        hashChange = false;
        window.location.hash = "#temporary";
        setTimeout(() => {
            hashChange = false;
            window.location.hash = "#";
        }, 1);
    }
}

window.onhashchange = () => {
    if (hashChange) {
        navigateURL();
    } else {
        hashChange = true;
    }
};

// Year Selection
function yearSelect(year, changeHash) {
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
                monthSelect(active.month, false);
            }
            yearElement.classList.remove("select-active");
            active.year = undefined;
            document.getElementById("select-month").classList.add("noDisplay");
            if (changeHash) {
                hashChange = false;
                window.location.hash = "#";
            }
        } else {
            // Otherwise, make the previous active year not active anymore
            if (active.year) {
                document.getElementById(`syear-${active.year}`).classList.remove("select-active");
            }
            if (active.challenge) {
                challengeSelect(active.challenge, false);
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
                document.getElementById(`smonth-${months[i]}`).setAttribute("data-unreleased", "");
                document.getElementById(`smonth-${months[i]}`).classList.remove("select-active");
            }
            for (let i = 1; i <= 3; i++) {
                // For every challenge, if it has select-active, remove it.
                document
                    .getElementById(`schallenge-${i.toString()}`)
                    .classList.remove("select-active");
            }
            for (let i = 0; i < activeMonths.length; i++) {
                const currentMonth = document.getElementById(`smonth-${activeMonths[i]}`);
                // For every active month, show it. Then, if it is unreleased, give it data-unreleased. Otherwise, remove data-unreleased if it has it.
                currentMonth.classList.remove("noDisplay");
                currentMonth.classList.remove("data-unreleased");
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
            if (changeHash) {
                hashChange = false;
                window.location.hash = `#${active.year}`;
            }
        }
    }
}

// Month Selection
function monthSelect(month, changeHash) {
    const monthElement = document.getElementById(`smonth-${month}`);
    // If the selected month is released,
    if (!monthElement.hasAttribute("data-unreleased")) {
        // If the month that was clicked on is the active month, hide everything.
        if (month == active.month) {
            if (active.challenge) {
                challengeSelect(active.challenge, false);
            }
            monthElement.classList.remove("select-active");
            document.getElementById("select-challenge").classList.add("noDisplay");
            active.month = undefined;
            if (changeHash) {
                hashChange = false;
                window.location.hash = `#${active.year}`;
            }
        } else {
            // Otherwise, if there is an active month, then make it not active anymore.
            if (active.month) {
                document.getElementById(`smonth-${active.month}`).classList.remove("select-active");
            }
            if (active.challenge) {
                challengeSelect(active.challenge, false);
            }
            // Then, make the selected month active.
            document.getElementById(`smonth-${month}`).classList.add("select-active");
            // Unhide the challenge selector.
            document.getElementById("select-challenge").classList.remove("noDisplay");
            // Make the active month the selected month.
            active.month = month;
            // Make the active challenge not active anymore.
            active.challenge = undefined;
            if (changeHash) {
                hashChange = false;
                window.location.hash = `${active.year}-${active.month}`;
            }
        }
        for (let j = 1; j <= 3; j++) {
            if (cman.information[active.year][month][j.toString()] == false) {
                // For every challenge, if it is unreleased, give it data-unreleased.
                document
                    .getElementById("schallenge-" + j.toString())
                    .setAttribute("data-unreleased", "");
                // Then, if it has select-active, remove select-active.
                document
                    .getElementById("schallenge-" + j.toString())
                    .classList.remove("select-active");
            }
            if (cman.completed[active.year]) {
                // If the completed cookie includes the current year,
                if (cman.completed[active.year][month]) {
                    // Then, if the completed cookie includes the current month,
                    if (cman.completed[active.year][month][j.toString()] === true) {
                        // Then, if the current challenge is completed, add the completed class.
                        document
                            .getElementById("schallenge-" + j.toString())
                            .classList.add("completed");
                    } else if (cman.completed[active.year][month][j.toString()] === 0.5) {
                        // Else, if it is in progress, then add the in-progress class to it.
                        document
                            .getElementById("schallenge-" + j.toString())
                            .classList.add("in-progress");
                    } else {
                        // Otherwise, remove the completed and in-progress classes if it has them.
                        document
                            .getElementById("schallenge-" + j.toString())
                            .classList.remove("completed");
                        document
                            .getElementById("schallenge-" + j.toString())
                            .classList.remove("in-progress");
                    }
                    // If the completed cookie does not include the current month, the remove the completed class if it has it.
                } else {
                    document
                        .getElementById("schallenge-" + j.toString())
                        .classList.remove("completed");
                }
                // Otherwise, if the completed cookie does not include the current year, then remove the completed class if it has it.
            } else {
                document.getElementById("schallenge-" + j.toString()).classList.remove("completed");
            }
        }
    }
}

// Challenge Selection
function challengeSelect(challenge, changeHash) {
    const challengeElement = document.getElementById(`schallenge-${challenge}`);
    // If the challenge is released,
    if (!challengeElement.hasAttribute("data-unreleased")) {
        // Then, if the challenge that was clicked is the active challenge, then hide everything.
        if (challenge == active.challenge) {
            document.getElementById("challenge").classList.add("noDisplay");
            document.getElementById(`schallenge-${challenge}`).classList.remove("select-active");
            active.challenge = undefined;
            if (changeHash) {
                hashChange = false;
                window.location.hash = `#${active.year}-${active.month}`;
            }
        } else {
            // Otherwise, if there is an active challenge, remove select-active from it.
            if (active.challenge) {
                document
                    .getElementById(`schallenge-${active.challenge}`)
                    .classList.remove("select-active");
            }
            // Then, give the newly selected challenge select-active.
            document.getElementById(`schallenge-${challenge}`).classList.add("select-active");
            // Hide the challlenge.
            document.getElementById("challenge").classList.add("noDisplay");
            // Unhide the challenge load animation.
            document.getElementById("challenge-loading").classList.remove("noDisplay");
            // Then, set the active challenge to the current challenge.
            active.challenge = challenge;
            if (changeHash) {
                hashChange = false;
                window.location.hash = `${active.year}-${active.month}-${active.challenge}`;
            }
            try {
                document.getElementById("challengeIframe").remove();
            } catch {}
            const iframe = document.createElement("iframe");
            iframe.id = "challengeIframe";
            iframe.src = `${active.pack.url}/${active.year}/${active.month}/${active.challenge}.html`;
            document.getElementById("challenge").appendChild(iframe);
            iframe.style.overflowY = "visible";
            iframe.setAttribute("scrolling", "no");
            iframe.addEventListener("load", () => {
                if (iframe.src != "about:blank") {
                    document.getElementById("challenge").classList.remove("noDisplay");
                    document.getElementById("challenge-loading").classList.add("noDisplay");
                    iframe.height = iframe.contentWindow.document.body.scrollHeight + 100;
                }
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
        if (year === "metadata") continue;
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
            yearSelect(year, true);
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
        monthSelect(month, true);
    });
});

[1, 2, 3].forEach(challenge => {
    document.getElementById("schallenge-" + challenge).addEventListener("click", () => {
        challengeSelect(challenge, true);
    });
});

// Highlighting Completed Challenges
function highlightChallenges() {
    // For each year, count the number of challenges.
    for (const year in cman.completed) {
        if (!(year in cman.information)) break;
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
                    partial = true;
                    partialMonth = true;
                    if (challengeValue === true) {
                        monthCount++;
                    }
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
function copy(text) {
    if (!navigator.clipboard) {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    } else {
        navigator.clipboard.writeText(text).catch(() => {
            const tempInput = document.createElement("input");
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
        });
    }
}
function download(content) {
    const temporaryAnchor = document.createElement("a");
    const blob = new Blob([content], {type: "text/plain"});
    temporaryAnchor.href = window.URL.createObjectURL(blob);
    temporaryAnchor.download = "twelve-of-code-data.txt";
    temporaryAnchor.click();
}

function initializeSettings() {
    const settingsButton = document.getElementById("settings");
    const settingsElement = document.getElementById("editSettings");
    const usernameInput = document.getElementById("input-username");
    const seedInput = document.getElementById("input-seed");
    const importDataButton = document.getElementById("import-data");
    const exportDataButton = document.getElementById("export-data");

    // Event listener for when the settings button is clicked
    settingsButton.addEventListener("click", () => {
        // Toggle the display of the settings
        settingsElement.classList.toggle("noDisplay");
        // Reset the hovered class on the import and export data buttons
        Array.from(document.getElementsByClassName("hvr-bob")).forEach(element => {
            element.classList.remove("hovered");
        });

        // Set the value of the username cookie to a random username if there is no username
        if (!cman.user.username) {
            cman.user.username = cman.blankUserCookie.username;
        }

        // Set the value of the seed cookie to a random seed if there is no seed
        if (!cman.user.seed) {
            const userCookie = cman.user;
            userCookie.seed = cman.blankUserCookie.seed;
            cman.user = userCookie;
        }
        // Set the values of the username and seed inputs to the values of the username and seed cookies, respectively
        usernameInput.value = cman.user.username;
        seedInput.value = cman.user.seed;
    });

    // Event listener for when the username input is changed
    usernameInput.addEventListener("change", () => {
        const userCookie = cman.user;
        userCookie.username = usernameInput.value;
        cman.user = userCookie;
    });

    // Event listener for when the seed input is changed
    seedInput.addEventListener("change", () => {
        if (/^[1-9]\d{9}$/.test(seedInput.value)) {
            const userCookie = cman.user;
            userCookie.seed = Number(seedInput.value);
            cman.user = userCookie;
        } else {
            seedInput.value = cman.user.seed;
            ErrorToast.fire("The seed must be a 10 digit number that doesn't start with a 1.");
        }
    });

    // Event listener for when the export data button is clicked
    exportDataButton.addEventListener("click", () => {
        const inputValue = btoa(
            JSON.stringify({
                completed: cman.completed,
                user: cman.user
            })
        );
        Swal.fire({
            title: "Export Data",
            input: "textarea",
            inputValue,
            inputAttributes: {
                "aria-label": "Export Data",
                "title": "Export Data",
                "style": "resize:none;cursor:text",
                "disabled": ""
            },
            showDenyButton: true,
            denyButtonText: "Download",
            confirmButtonText: "Copy",
            showCloseButton: true
        }).then(result => {
            if (result.isConfirmed) {
                // When copy to clipboard is clicked
                copy(inputValue);
                ErrorToast.fire({
                    icon: "success",
                    text: "Successfully copied to clipboard."
                });
            } else if (result.isDenied) {
                // When download file is clicked
                download(inputValue);
                ErrorToast.fire({
                    icon: "success",
                    text: "Successfully downloaded."
                });
            }
        });
    });

    // Event listener for when the import data button is clicked
    importDataButton.addEventListener("click", async () => {
        const response = await Swal.fire({
            title: "Import Data",
            input: "textarea",
            inputAttributes: {
                "aria-label": "Import Data",
                "title": "Import Data",
                "style": "resize:none;cursor:text"
            },
            inputPlaceholder: "Paste your data here or upload it.",
            showDenyButton: true,
            denyButtonText: `Upload File`,
            showCloseButton: true,
            preDeny: () => {
                document.getElementById("hiddenFileUpload").click();
                dataInputUUID = crypto.randomUUID();
                return dataInputUUID;
            }
        });
        if (response.isConfirmed || response.isDenied) {
            handleDataInput(response.value);
        }
    });
}

// Event listener for when a file is uploaded
document.getElementById("hiddenFileUpload").addEventListener("change", event => {
    const file = event.target.files[0];
    if (file.type && file.type !== "text/plain") {
        ErrorToast.fire("Please only upload text files.");
        return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", fileReaderResult => {
        handleDataInput(fileReaderResult.target.result);
    });
    reader.readAsText(file);
});

// Function to handle when data is submitted
function handleDataInput(data) {
    if (!data) {
        ErrorToast.fire("You did not enter any data.");
        return false;
    }
    if (data !== dataInputUUID) {
        data = validateData(data);
        if (data) {
            cman.completed = data.completed;
            cman.user = data.user;
            ErrorToast.fire({
                icon: "success",
                text: "Data successfully changed. Reloading..."
            }).then(() => {
                location.reload();
            });
        } else {
            ErrorToast.fire({
                text: "The data you have entered is invalid."
            });
        }
    }
}

function validateData(data) {
    try {
        data = JSON.parse(atob(data));
        if (
            Object.keys(data).length === 2 &&
            data.completed &&
            data.user.username &&
            /^[1-9]\d{9}$/.test(data.user.seed)
        ) {
            const completed = data.completed;
            for (const year in completed) {
                if (!(year in cman.information)) {
                    delete completed[year];
                } else {
                    const yearObj = completed[year];
                    for (const month in yearObj) {
                        if (!(month in cman.information[year])) {
                            delete completed[year][month];
                        } else {
                            const monthObj = completed[year][month];
                            for (const challenge in monthObj) {
                                if (!(challenge in cman.information[year][month])) {
                                    delete completed[year][month][challenge];
                                }
                            }
                        }
                    }
                }
            }
            data.completed = completed;
            return data;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}
