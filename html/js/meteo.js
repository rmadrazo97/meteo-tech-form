var countries = {
    "MX": {
        "name": "México",
        "code": "+52"
    },
    "BZ": {
        "name": "Belice",
        "code": "+501"
    },
    "GT": {
        "name": "Guatemala",
        "code": "+502"
    },
    "ES": {
        "name": "El Salvador",
        "code": "+503"
    },
    "HN": {
        "name": "Honduras",
        "code": "+504"
    },
    "NI": {
        "name": "Nicaragua",
        "code": "+505"
    },
    "CR": {
        "name": "Costa Rica",
        "code": "+506"
    },
    "PA": {
        "name": "Panamá",
        "code": "+507"
    }
};
var farmerType = null;
var crops = {
    "fruits" : {
        "selected" : false,
        "crops" : []
    },
    "vegetables" : {
        "selected" : false,
        "crops" : []
    },
    "ornamental" : {
        "selected" : false,
        "crops" : []
    },
}
var userLocation = {
    "address": null,
    "lat": null,
    "lon": null,
    "country":null
}

var userData = {
    name: null,
    email: null,
    phone: null,
    country: null
}

var alerts = [
    {
        variable: null,
        min: null,
        max: null
    },
    {
        variable: null,
        min: null,
        max: null
    },
    {
        variable: null,
        min: null,
        max: null
    }
]


window.addEventListener("message", (event) => {
    console.log(event);
    if(event.data[0] == 'selectedAddress'){
        console.log(event.data);
        $('#meteo-map-address').val(event.data[1]);
        $('#meteo-map-lat').val(event.data[2]);
        $('#meteo-map-lon').val(event.data[3]);
        // setting values in glovars
        userLocation.address = event.data[1];
        userLocation.lat = event.data[2];
        userLocation.lon = event.data[3];

        setTimeout(() => {
            $('#forwardButton').click();
        }, 300);
    }
    
}, false);

$( ".select-card" ).click(function() {
    console.log($(this).attr('cropType'));
    crops[$(this).attr('cropType')].selected = !crops[$(this).attr('cropType')].selected;
    console.log(crops);
    $("#"+$(this).attr('drop-down')).toggle();
    setTimeout(() => {
        $("#"+$(this).attr('drop-down')+" > div > button").click();
    }, 150);
    
  });

$( ".farmerType" ).click(function() {
    var element = document.querySelector("footer");
    element.scrollIntoView({behavior: "smooth"});
    console.log('Farmer Type: '+$(this).attr('farmerType'));
    farmerType = $(this).attr('farmerType');
});

$( ".stepButton" ).click(function() {
    console.log('step');
    setTimeout(function(){ 
        scrollToTop();
    }, 600);
});

function scrollToTop() {
    if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
        window.scrollBy(0, -50);
        requestAnimationFrame(scrollToTop);
    }
}

function addNotification(){
        var count = $('#notificationsTable tr').length;
        console.log('new alert, current  value: '+count);
        if(count == 4){
            alert('Solo puedes agregar hasta 3 alertas.');
            return;
        }

        const table = document.getElementById("notificationsTable");
        // new row
        var row = table.insertRow(-1);
        // 2 cells
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        // 1st cell: variable dropdown
        cell1.innerHTML = `
        <div class="styled-select">
            <select class="alertsSelect" onchange="alertChange(this)" name="country">
                <option value="" selected>Variable</option>
                <option value="temp">Temperatura (Cº)</option>
                <option value="precip">Precipitación</option>
                <option value="winds">Velocidad de Viento</option>
            </select>
        </div>
        `;
        // 2nd cell: min:max values 
        cell2.innerHTML = `
        <div class="row justify-content-between">
            <div class="col-6">
                <div class="row justify-content-center">
                    <input type="number" step="0.1" min="-999" max="+999" class="alertsMin required form-control mx-2 border-success mb-1 " >
                    <small>Menor que</small>
                </div>
            </div>
            <div class="col-6">
                <div class="row justify-content-center">
                    <input type="number" step="0.1" min="-999" max="+999" class="alertsMax required form-control mx-2 border-danger mb-1 ">
                    <small>Mayor que</small>
                </div>
            </div>
        </div>
        `;
}

function removeNotification(){
    var count = $('#notificationsTable tr').length;
    console.log(count);
    if(count == 2){
        return;
    } else {
        const table = document.getElementById("notificationsTable");
        table.deleteRow(-1);
    }
    
}

function selectChange(selectId){
    var select = $('#'+selectId);
    crops[select.attr('cropType')].crops = select.val();
    console.log(select.val());
}

function alertChange(element){
    console.log(element);
    switch (element.value) {
        case "temp":
            if(element.parentElement.parentElement.nextElementSibling.children[0].children.length > 2){
                element.parentElement.parentElement.nextElementSibling.children[0].children[2].remove(); 
            }
            element.parentElement.parentElement.nextElementSibling.children[0].children[0].style.display = "block";
            element.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].children[0].classList.add("required");

            break;
        case "precip":
            if(element.parentElement.parentElement.nextElementSibling.children[0].children.length > 2){
                element.parentElement.parentElement.nextElementSibling.children[0].children[2].remove(); 
            }
            element.parentElement.parentElement.nextElementSibling.children[0].children[0].style.display = "none";
            element.parentElement.parentElement.nextElementSibling.children[0].children[1].insertAdjacentHTML('afterend',
            `
            <div class="col-6 alert-label">
                    <div class="row justify-content-center" data-children-count="1">
                        <p class="mt-3">mm/dia</p>
                    </div>
                </div>
            `);
            element.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].children[0].classList.remove("required");
            

            break;
        case "winds":
            if(element.parentElement.parentElement.nextElementSibling.children[0].children.length > 2){
                element.parentElement.parentElement.nextElementSibling.children[0].children[2].remove(); 
            }
            element.parentElement.parentElement.nextElementSibling.children[0].children[0].style.display = "none";
            element.parentElement.parentElement.nextElementSibling.children[0].children[1].insertAdjacentHTML('afterend',
            `
            <div class="col-6 alert-label">
                    <div class="row justify-content-center" data-children-count="1">
                        <p class="mt-3">km/h</p>
                    </div>
                </div>
            `);
            element.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].children[0].classList.remove("required");

            break;
    
        default:
            break;
    }
}

function handleSubmit(){
    userData.name = $('#userName').val(),
    userData.email = $('#userEmail').val(),
    userData.country = $('#userCountry').val(),
    userData.phone = $('#userCel').val();

    $("#notificationsTable tr").each(function(i) { 
        if(i !== 0){
            alerts[i-1].variable = $(this).find('.alertsSelect').first().val();
            alerts[i-1].min = $(this).find('.alertsMin').first().val();
            alerts[i-1].max = $(this).find('.alertsMax').first().val();
        }
    });

    setTimeout(() => {
        // console form data
        console.log(userData);
        console.log(farmerType);
        console.log(userLocation);
        console.log(alerts);
        console.log(crops);  

        userLocation.country = countries[userData.country].name;

        // create user
        var settings = {
            "url": "https://meteo-tech-users.herokuapp.com/user",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "email": userData.email,
              "displayName": userData.name,
              "phoneNum": countries[userData.country].code+userData.phone,
              "country": userLocation.country,
              "lat": userLocation.lat,
              "lon": userLocation.lon,
              "type": farmerType,
              "fruits_b": crops.fruits.selected,
              "vegetables_b": crops.vegetables.selected,
              "ornamental_b": crops.ornamental.selected,
              "country_code": userData.country

            }),
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            // after user is successfully created add settings object 
            var settings2 = {
                "url": "https://meteo-tech-users.herokuapp.com/user/settings",
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                  "uid": response.userId,
                  "email": response.email,
                  "type": farmerType,
                  "crops": crops,
                  "location": userLocation,
                  "alerts": alerts
                }),
              };
              
              $.ajax(settings2).done(function (response2) {
                console.log(response2);
                window.location.href = './success.html'; 
              });

          });

    }, 100);

    
}

function IgnoreAlpha(e) {
    if (!e) {
      e = window.event;
    }
    if (e.keyCode >= 65 && e.keyCode <= 90) // A to Z
    {
      e.returnValue = false;
      e.cancel = true;
    }
  }