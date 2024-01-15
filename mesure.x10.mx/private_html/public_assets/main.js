let epochs = document.getElementsByClassName("epoch");
for (var i = 0; i < epochs.length; i++) {
    let timestamp = parseInt(epochs[i].innerText, 10);
    let date = new Date(timestamp * 1000); // Convert to milliseconds
    let formattedDate = date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZoneName: 'short' 
    });
    epochs[i].innerText = formattedDate;
}