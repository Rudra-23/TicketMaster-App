
function getEventDetails(id) {
    let url =  url_head + `/search/id?eventid=${id}`
    
    response = fetch(url)
    .then(data => data.json())
    .then(event => {
        clear_the_details();

        let details_card = document.createElement('div')
        details_card.className = 'details_card'
        let details_title = document.createElement('div')
        details_title.className = 'details_title'
        details_title.innerHTML = `<p>${event.name}</p>`
        let details_body = document.createElement('div')
        details_body.className = 'details_body'
        details_card.appendChild(details_title)
        details_card.appendChild(details_body)
        let details_info = document.createElement('div')
        details_info.className = 'details_info'
        let details_image = document.createElement('div')
        details_image.className = 'details_image'
        details_body.appendChild(details_info)
        details_body.appendChild(details_image)

        
        if(event.hasOwnProperty('dates') && event['dates'].hasOwnProperty('start')) {
            let localDate = event['dates']['start'].localDate 
            let localTime = event['dates']['start'].localTime
            if(localDate != undefined && localTime != undefined) {

                let div = document.createElement('div')
                div.className = 'details_info_values';
                div.innerHTML = `<p class="info_bold">Date</p> 
                                        <p class="info_text">${localDate + ' ' + localTime}</p>`
                details_info.appendChild(div)
            }
        }

        
        let artistTeam = [] 
        if(event.hasOwnProperty('_embedded') && event['_embedded'].hasOwnProperty('attractions')) {
            for(let i = 0; i<event['_embedded']['attractions'].length; i++) {
                if(event['_embedded']['attractions'][i].hasOwnProperty('name') && 
                event['_embedded']['attractions'][i].name.toLowerCase() != 'undefined') {
                    
                    if(event['_embedded']['attractions'][i].hasOwnProperty('url')) {
                        let url = event['_embedded']['attractions'][i].url
                        artistTeam.push(`<a href = ${url} target = '_blank' >${event['_embedded']['attractions'][i].name}</a>`)
                    }
                    else {
                        artistTeam.push(`<p style= "color:rgb(62, 175, 232); font-size:smaller">${event['_embedded']['attractions'][i].name}</p>`)
                    }
                    
                }
            }
        } 
        if(artistTeam.length != 0) {
            artistTeam = artistTeam.join(' | ')
            let div = document.createElement('div')
            div.className = 'details_info_values';
            div.innerHTML = `<p class="info_bold">Artist/Team</p> 
                                    <p class="info_text" ">${artistTeam}</p>`
            details_info.appendChild(div)
        }

        
        let venue = ''
        if(event.hasOwnProperty('_embedded') && event['_embedded'].hasOwnProperty('venues') &&
        event['_embedded']['venues'].length != 0 && event['_embedded']['venues'][0].hasOwnProperty('name')) {
            venue = event['_embedded']['venues'][0].name
            if(venue != undefined && venue.toLowerCase() != 'undefined') {
                let div = document.createElement('div')
                div.className = 'details_info_values';
                div.innerHTML = `<p class="info_bold">Venue</p> 
                                        <p class="info_text">${venue}</p>`
                details_info.appendChild(div)
            }
        }
        
        let genre_arr = []
        if(event.hasOwnProperty('classifications')) {
            for(let i = 0; i < event['classifications'].length; i++) {
                for(let ele of ['subGenre', 'genre', 'segment','subType', 'type']) {
                    if(event['classifications'][i].hasOwnProperty(ele) && 
                    event['classifications'][i][ele].hasOwnProperty('name')) {
                        if(event['classifications'][i][ele].name.toLowerCase() != 'undefined')
                            genre_arr.unshift(event['classifications'][i][ele].name)
                    }
                }
            }
        }
        if(genre_arr.length != 0) {
            genre_arr = genre_arr.join(' | ')
            let div = document.createElement('div')
            div.className = 'details_info_values';
            div.innerHTML = `<p class="info_bold">Genres</p> 
                                    <p class="info_text">${genre_arr}</p>`
            details_info.appendChild(div)
        }
        

        if(event.hasOwnProperty('priceRanges') && event['priceRanges'].length != 0) {
            if(event['priceRanges'][0].hasOwnProperty('min') && event['priceRanges'][0].hasOwnProperty('min')) {
                let price_ranges_min = event['priceRanges'][0].min
                let price_ranges_max =  event['priceRanges'][0].max
                let div = document.createElement('div')
                div.className = 'details_info_values';
                div.innerHTML = `<p class="info_bold">Price Ranges</p> 
                                        <p class="info_text">${price_ranges_min + ' - ' + price_ranges_max} USD</p>`
                details_info.appendChild(div)
            } 
        }
        
        if(event.hasOwnProperty('dates') && event['dates'].hasOwnProperty('status') 
        && event['dates']['status'].hasOwnProperty('code')) {
            let statusCode = event['dates']['status'].code

            let color = ''
            let code = ''
            if(statusCode == 'onsale') {
                color = 'green'; code = 'On Sale';
            }
            else if (statusCode == 'offsale') {
                color = 'red'; code = 'Off Sale';
            }
            else if(statusCode == 'cancelled') {
                color = 'black'; code = 'Canceled'
            }
            else if(statusCode == 'rescheduled'){
                color = 'orange'; code = 'Rescheduled'
            }
            else {
                color = 'orange'; code = 'Postponed'
            }

            let div = document.createElement('div')
            div.className = 'details_info_values';
            div.innerHTML = `<p class="info_bold">Ticket Status</p> 
                            <span class="info_text info_text_${color}">${code}</span>`
            details_info.appendChild(div)
        }
    
        if(event.hasOwnProperty('url')) {
            let buyTicketAt = event['url']

            let div = document.createElement('div')
            div.className = 'details_info_values';
            div.innerHTML = `<p class="info_bold">Buy Ticket At:</p> 
                            <p class="info_text"><a href ='${buyTicketAt}'" 
                            target="_blank">Ticketmaster</a>
                            </p>`
            details_info.appendChild(div)
        }
        else {
            let div = document.createElement('div')
            div.className = 'details_info_values';
            div.innerHTML = `<p class="info_bold">Buy Ticket At:</p> 
                            <p class="info_text">Ticketmaster</p>`
            details_info.appendChild(div)
        }

        if(event.hasOwnProperty('seatmap') && event['seatmap'].hasOwnProperty('staticUrl')) {
            let seatMap = event['seatmap'].staticUrl

            let div = document.createElement('div')
            div.className = 'seatmap';
            div.innerHTML = `<img src = '${seatMap}' alt = 'seatmap' />`
            details_image.appendChild(div)
        }
        document.getElementsByClassName('main_body')[0].appendChild(details_card)
    
        let button_div = document.createElement('div')
        button_div.className = 'get_more_details'
        if(venue.includes("'")) {
            venue = venue.replace("'", "#")
        }
        
        button_div.innerHTML = `<button class = "more_details_button" onclick = 'getVenueDetails("${venue}")'> 
        Show Venue Details <br> <p> <i class="arrow-down"></i></p></button>`
        document.getElementsByClassName('main_body')[0].appendChild(button_div)

        details_card.scrollIntoView({behavior: "smooth"});
    })
}

function getVenueDetails(name) {
     if(name.includes("#")) {
            name = name.replace("#", "'")
        }
    let url = url_head + `/search/venue?name=${name}`
    response = fetch(url)
    .then(data => data.json())
    .then(venue => {
        
        let button_div = document.getElementsByClassName('get_more_details')[0];
        if(button_div != undefined) {
            document.getElementsByClassName('main_body')[0].removeChild(button_div);
        }

        venue = venue['_embedded']['venues'][0]

        let name = 'N/A'
        if(venue.hasOwnProperty('name')) name = venue['name']

        let street_address = ''
        if(venue.hasOwnProperty('address') && venue['address'].hasOwnProperty('line1'))
            street_address =  venue['address'].line1

        let city = 'N/A'
        if(venue.hasOwnProperty('city') && venue['city'].hasOwnProperty('name')) 
            city = venue['city'].name

        let stateCode = (venue.hasOwnProperty('state') && 
        venue['state'].hasOwnProperty('stateCode'))? venue['state'].stateCode:'N/A'
        let zipcode = (venue.hasOwnProperty('postalCode'))? venue['postalCode']:'N/A'
        let url = (venue.hasOwnProperty('url'))? venue['url']:'#'

        let image = ''
        if(venue.hasOwnProperty('images') && venue['images'].length != 0 && 
        venue['images'][0].hasOwnProperty('url')) {
            image = venue['images'][0].url
        }
        

        let venue_card = document.createElement('div')
        venue_card.className = 'venue_card'

        venue_card.innerHTML = `
         <div class="venue_body">
            <div class="venue_head">
                <div class="venue_title">
                &nbsp; ${name} &nbsp;
                </div>
            </div>
            
            <div class="venue_info">
            <div class = "venue_entire_add">
                <div class = "venue_complete_add">
                    <div class="venue_address_text"><b>Address: &nbsp; </b></div>
                    <div class="venue_address">
                        ${ street_address} <br> ${city}, ${stateCode} <br> ${zipcode}
                    </div>
                </div>
                <div class ="venue_map"><a href = 'https://www.google.com/maps/search/?api=1&query=${street_address + '+' + city+ '+' + stateCode + '+' + zipcode}' target = '_blank'>Open in Google Maps</a>
                </div>
                </div>
                <div class="venue_more_events">
                    <a href = "${url}" target = '_blank' ${url == '#'?'disabled':''}> More events at this venue <a> 
                </div>
            </div>
        </div>`

        document.getElementsByClassName('main_body')[0].appendChild(venue_card)

        if(image != '') {
            let logo = document.createElement('div')
            logo.className = 'venue_logo'
            logo.innerHTML = `<img src = ${image} alt = "image" />`
            document.getElementsByClassName('venue_head')[0].appendChild(logo)
        }

        venue_card.scrollIntoView({behavior: "smooth"});

    })
}
