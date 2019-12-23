window.addEventListener("load", Init);

let devicesArr = [];

let city = {
    name: "Rivne",
    url: "https://api.privatbank.ua/p24api/infrastructure?json&tso&address=&city=",

    GetUrl() {
        return this.url + this.name;
    }
}

function Init() {
    const btnsearch = document.querySelector(".btn-search");
    btnsearch.addEventListener("click", GetData);
    Request(city.GetUrl(), Print);
    initMap();
}

function GetData() {
    const newname = document.querySelector(".city-input").value;
    city.name = newname;
    Request(city.GetUrl(), Print);
}

function Request(URL, callback) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL, true);
    xhr.onreadystatechange = function (aEvt) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                callback(data);
            } else {
                console.log("Error loading page\n");
            }
        }
    };
    xhr.send(null);
}

function Print({
    devices
}) {
    let printTerminals = document.getElementById("root");

    let table = document.createElement("table");
    table.setAttribute("class", "tblTerminals");

    let checkTable = document.getElementsByClassName("tblTerminals");
    if (checkTable.length > 0) {
        printTerminals.removeChild(printTerminals.lastChild);
    }

    if (devices.length == 0) {
        let tr = document.createElement("tr");

        let tableError = document.createElement("td");
        tableError.innerHTML = "This town doesn't exist";
        tableError.setAttribute("class", "tableError");

        tr.appendChild(tableError);

        table.appendChild(tr);
    }


    for (let i = 0; i < devices.length; i++) {
        let tr = document.createElement("tr");

        let tablePlace = document.createElement("td");
        tablePlace.innerHTML = devices[i].placeUa;
        tr.appendChild(tablePlace);

        let tableAddress = document.createElement("td");
        tableAddress.innerHTML = devices[i].fullAddressUa;
        tr.appendChild(tableAddress);

        let btnID = i;
        let btnShowInMap = document.createElement("button");
        btnShowInMap.setAttribute("type", "button");
        btnShowInMap.setAttribute("class", "btn btn-info btn-show_in_map");
        btnShowInMap.setAttribute("value", `${btnID}`);
        btnShowInMap.textContent = "Show on map";
        btnShowInMap.addEventListener("click", ShowInMap);
        tr.appendChild(btnShowInMap)

        table.appendChild(tr);

        let coord = {
            latitude: devices[btnID].latitude,
            longitude: devices[btnID].longitude
        };
        devicesArr.push(coord);
    }

    printTerminals.appendChild(table);
}

function ShowInMap() {
    const id = this.value;

    let {
        latitude,
        longitude
    } = devicesArr[id];
    initMap(longitude, latitude);
}

function initMap(newLat = 50.61681, newLng = 26.27306) {
    var coord = {
        lng: parseFloat(newLng),
        lat: parseFloat(newLat),
    }

    let map = new google.maps.Map(document.getElementById("map"), {
        center: coord,
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: coord,
        map: map,
        title: 'Hello World!'
    });
}