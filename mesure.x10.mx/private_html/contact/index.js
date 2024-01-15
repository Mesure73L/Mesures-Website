function isDaylightSavingTime() {
    const now = new Date();
    const timeZone = 'America/Chicago'; // American Central Time

    const options = {
        timeZone,
        timeZoneName: 'short',
    };

    const formatter = new Intl.DateTimeFormat([], options);
    const [, , , , , , timeZoneAbbr, dst] = formatter.formatToParts(now);

    return timeZoneAbbr === dst;
}

const isDaylightTime = isDaylightSavingTime();

if (isDaylightTime) {
    document.getElementById('tz-abbreviation').innerText = 'CDT';
    document.getElementById('tz-utcformat').innerText = 'UTC-05:00';
} else {
    document.getElementById('tz-abbreviation').innerText = 'CST';
    document.getElementById('tz-utcformat').innerText = 'UTC-06:00';
}