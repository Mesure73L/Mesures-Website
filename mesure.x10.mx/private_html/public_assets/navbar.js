fetch('https://mesure.x10.mx/public_assets/navbar.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.querySelector("script#replace_with_navbar");
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
    })

fetch('https://mesure.x10.mx/public_assets/mobile_navbar.js')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.querySelector("script#mobile_navbar");
        let newelem = document.createElement("script");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
    })