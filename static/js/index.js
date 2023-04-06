// Development link
// let url_head = 'http://127.0.0.1:5000/'

// Production link
let url_head = 'https://first-flask-project6.wl.r.appspot.com/'

function checkInputs(e) {

    e.preventDefault();

    let keyword = document.getElementById("keyword");
    let locationText = document.getElementById("locationText");
    let distance_miles = document.getElementById("distance_miles");

    if (!keyword.checkValidity()) {
        keyword.reportValidity();
    }
    else if (!locationText.checkValidity()) {
        locationText.reportValidity();
    }
    else if(!distance_miles.checkValidity()) {
        distance_miles.reportValidity();
    }
    else {
        getValues(e)
    }
}

function getValues(e) {
    
    e.preventDefault();

    let keyword = document.getElementById("keyword").value;
    let category = document.getElementById("category").value;
    let distance_miles = document.getElementById("distance_miles").value;
    let locationText = document.getElementById("locationText").value;
    let location = document.getElementById('location').checked
    
    let combine_url = '';
    combine_url += "keyword=" + keyword
    combine_url += "&category=" + category
    if(distance_miles == '') {
        combine_url += "&distance_miles=10"
    }
    else {
        combine_url += "&distance_miles=" + distance_miles
    }
    

    let latitude = undefined;
    let longitude = undefined;

    if(location) {
         let ipinfo_API = ''
         let ipinfo_url = `https://ipinfo.io/?token=${ipinfo_API}`

         let data = fetch(ipinfo_url)
         data.then(data => data.json())
         .then(location_response => {
            
            latitude = location_response['loc'].split(',')[0]
            longitude = location_response['loc'].split(',')[1]

            combine_url += "&latitude=" + latitude
            combine_url += "&longitude=" + longitude

            final_url = url_head + 'search?'+combine_url
            getEvents(final_url)
         })        
    }
    else {
        let geocoding_API = '' 
        let location_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationText}&key=${geocoding_API}` 
        let data = fetch(location_url)
         data.then(data => data.json())
                    .then(location_response => {
                        if(location_response.results.length == 0) {
                            clean_the_output();
                            let message = document.createElement('div')
                            message.className = 'message'
                            let p_tag = document.createElement('p')
                            p_tag.className = 'p_tag'
                            p_tag.innerHTML = '<b>No Records found</b>'
                            message.appendChild(p_tag)

                            document.getElementsByClassName('main_body')[0].appendChild(message)
                        }
                        else {
                            latitude = location_response["results"][0]["geometry"]["location"]["lat"]
                            longitude = location_response["results"][0]["geometry"]["location"]["lng"]
                        
                            combine_url += "&latitude=" + latitude
                            combine_url += "&longitude=" + longitude

                            final_url = url_head + 'search?'+ combine_url
                            getEvents(final_url)
                        }
                    })
    }
}

function resetValues(e) {

    e.preventDefault();

    document.getElementById("keyword").value = "";
    document.getElementById("category").value = "Default";
    document.getElementById("distance_miles").value = '';
    document.getElementById('location').checked = false;
    
    let element = document.getElementById("locationText")
    if(element.style.display == 'none') {
        locationText.required = true;
        element.style.display = 'block';
    }
    element.value = "";
    clean_the_output();
}

function disable() {
    let location = document.getElementById('location').checked

    let locationText = document.getElementById('locationText')
    if(location == true) {
        locationText.required = false;
        locationText.style.display = 'none';
    }
    else {
        locationText.required = true;
        locationText.style.display = 'block';
    }
}

function clean_the_output() {
    let main_body = document.getElementsByClassName('main_body')[0];
    let table = document.getElementsByClassName('events_table')[0];
    let message = document.getElementsByClassName('message')[0];

    if(table != undefined)
        main_body.removeChild(table);
    if(message != undefined)
        main_body.removeChild(message);
    clear_the_details();
}

function clear_the_details() {
    let main_body = document.getElementsByClassName('main_body')[0];
    let details_card = document.getElementsByClassName('details_card')[0];
    let venue_card = document.getElementsByClassName('venue_card')[0];
    let button_div = document.getElementsByClassName('get_more_details')[0];

    if(details_card != undefined) {
        main_body.removeChild(details_card);
    }
    if(venue_card != undefined) {
        main_body.removeChild(venue_card)
    }
    if(button_div != undefined) {
            document.getElementsByClassName('main_body')[0].removeChild(button_div);
    }
}