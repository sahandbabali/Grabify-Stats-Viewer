var map = L.map('map').setView([51.505, -0.09], 2);

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

let csvdata
let iparray = []

let osdiv = document.getElementById("osdiv")
let browserdiv = document.getElementById("browserdiv")




L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = d3.csvParse(text);
        csvdata = data;
        getipaddresses(csvdata)

        // calculate and add countries table
        calculatecountries(csvdata)

        oschart(csvdata)
        browserchart(csvdata)



    };

    reader.readAsText(input);
});

function getipaddresses(csvdata) {
    //  console.log(csvdata.length)
    for (let index = 0; index < csvdata.length; index++) {
        //   console.log(csvdata[index]["IP Address"])
        iparray.push(csvdata[index]["IP Address"])

    }
    // console.log(iparray)
    console.log("ip array created successfully and the length is: " + iparray.length)
    geolocate()

}

function geolocate() {
    console.log("geolocation started...")
    for (let index = 0; index < iparray.length; index++) {

        fetch('http://www.geoplugin.net/json.gp?ip=' + iparray[index]).then((response) => response.json())
            .then((data) => {
                let tempmark = L.marker([data.geoplugin_latitude, data.geoplugin_longitude]).addTo(map)
                //  console.log(data.geoplugin_longitude + " " +  data.geoplugin_latitude)
                tempmark.bindPopup(`${index}`)
            });

    }
    console.log("geolocate finished :)")

}

function calculatecountries(csvdata) {
    // console.log(csvdata)
    let countsarray = []
    for (let index = 0; index < csvdata.length; index++) {
        let countname = csvdata[index]["Country"].split(',')[0]
        countsarray.push(countname)
    }
    console.log(countsarray)

    const counts = {};

    for (const item of countsarray) {
        counts[item] = counts[item] ? counts[item] + 1 : 1;
    }
    console.log(counts)




    let sortable = [];
    for (var country in counts) {
        sortable.push([country, counts[country]]);
    }
    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });


    let sortedarray = sortable.reverse()
    console.log(sortedarray)

    // update the table
    let tablepart1 = `<div class="card">
    <h5 class="card-header">Countries</h5>
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Country</th>
            <th scope="col">Visitors</th>
          </tr>
        </thead>
        <tbody>`

    let tablelastpart = ` </tbody>
        </table>
      </div>
    </div>`

    for (let index = 0; index < 5; index++) {

        tablepart1 += ` <tr>
        <th scope="row">${index + 1}</th>
        <td>${sortedarray[index][0]}</td>
        <td>${sortedarray[index][1]}</td>
      </tr>`

    }

    tablepart1 += tablelastpart;
    document.getElementById("countriesbox").innerHTML = tablepart1


}

function oschart(csvdata) {
    let osarray = []
    for (let index = 0; index < csvdata.length; index++) {
        let osname = csvdata[index]["Operating System"]
        osarray.push(osname)
    }
    console.log(osarray)
    const counts = {};

    for (const item of osarray) {
        counts[item] = counts[item] ? counts[item] + 1 : 1;
    }
    console.log(counts)
    osdiv.style.display = "block"

    const ctx = document.getElementById('oscanvas')

    

    let oslabels = Object.keys(counts)
    let osdata = Object.values(counts)
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: oslabels,
            datasets: [{
                label: '#',
                data: osdata,
                borderWidth: 1
            }]
        },

    });

}


function browserchart (csvdata) {
    let browserarray = []
    for (let index = 0; index < csvdata.length; index++) {
        let browsername = csvdata[index]["Browser"]
        browserarray.push(browsername)
    }
    console.log(browserarray)
    const counts = {};

    for (const item of browserarray) {
        counts[item] = counts[item] ? counts[item] + 1 : 1;
    }
    console.log(counts)
    browserdiv.style.display = "block"

    const ctx = document.getElementById('browsercanvas')

    

    let browserlabels = Object.keys(counts)
    let browserdata = Object.values(counts)
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: browserlabels,
            datasets: [{
                label: '#',
                data: browserdata,
                borderWidth: 1
            }]
        },

    });
}

// Geolocation url
// https://www.geoplugin.com/quickstart
// http://www.geoplugin.net/json.gp?ip=176.100.243.133

