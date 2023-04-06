
function getEvents(url) {
    clean_the_output();
    
    response = fetch(url)
    response.then(data => data.json())
            .then(res => {
                if(res['page']['totalElements'] == 0) {
                    let message = document.createElement('div')
                    message.className = 'message'
                    let p_tag = document.createElement('p')
                    p_tag.className = 'p_tag'
                    p_tag.innerHTML = '<b>No Records found</b>'
                    message.appendChild(p_tag)

                    document.getElementsByClassName('main_body')[0].appendChild(message)
                }
                else {
                    createTable(res)
                }
            })
}

function createTable(res) {
    let table = document.createElement('table')
    table.className = 'events_table'
    let thead = document.createElement('thead')
    let temp = document.createElement('tr')
    temp.innerHTML = '<th>Date</th> <th>Icon</th> <th>Event</th> <th>Genre</th> <th>Venue</th>'
    thead.appendChild(temp)
    table.appendChild(thead)
    let events = res['_embedded']['events']
    
    let tbody = document.createElement('tbody');
    for(let i = 0; i < events.length && i < 20; i++) {
        
        let temp = document.createElement('tr')

        let event = document.createElement('td')
            event.innerHTML = `<p class = 'event_name' onclick = "getEventDetails('${events[i].id}')"> ${events[i].name}</p>`
            event.style.width = '40%'

        let date = document.createElement('td')
        let Date = ''
        let Time = ''
        if(events[i].hasOwnProperty('dates') && events[i]['dates'].hasOwnProperty('start')) {
                Date = events[i]['dates']['start'].localDate 
                Time = events[i]['dates']['start'].localTime
                if(Date == undefined || Date.toLowerCase() == 'undefined') {
                    Date = ''
                }
                if(Time == undefined || Date.toLowerCase() == 'undefined') {
                    Time = ''
                }
        }
        date.innerHTML = Date  + '<br>' + Time
        date.style.width = '15%'

        let icon = document.createElement('td')
        icon.style.width = '15%'
        let icon_image = document.createElement('img')
        let Image_url = ''
        if(events[i].hasOwnProperty('images') && events[i]['images'].length!=0 && events[i]['images'][0].hasOwnProperty('url')) {
            Image_url = events[i]['images'][0].url
            if(Image_url == undefined) {
                Image_url = ''
            }
        }
        icon_image.src = Image_url

        icon.appendChild(icon_image)

        let genre = document.createElement('td')
        let Genre = ''
        if(events[i].hasOwnProperty('classifications') && events[i]['classifications'].length!=0 &&
        events[i]['classifications'][0].hasOwnProperty('segment')) {
            Genre = events[i]['classifications'][0]['segment'].name
            if(Genre == undefined || Genre.toLowerCase() == 'undefined') {
                Genre = ''
            }
        }
        genre.textContent = Genre
        genre.style.width = '10%'

        let venue = document.createElement('td')
        let Venue = ''
        if(events[i].hasOwnProperty('_embedded') && events[i]['_embedded'].hasOwnProperty('venues')&& 
        events[i]['_embedded']['venues'].length != 0 &&
         events[i]['_embedded']['venues'][0].hasOwnProperty('name')) {
            Venue = events[i]['_embedded']['venues'][0].name
            if(Venue == undefined || Venue.toLowerCase() == 'undefined') {
                Venue = ''
            }
        }
        venue.textContent = Venue
        venue.style.width = '20%'

        temp.appendChild(date)
        temp.appendChild(icon)
        temp.appendChild(event)
        temp.appendChild(genre)
        temp.appendChild(venue)
        tbody.appendChild(temp)
        table.append(tbody)
    }
    document.getElementsByClassName('main_body')[0].appendChild(table);

    document.querySelectorAll(".events_table th").forEach(columnNo => {
	columnNo.addEventListener("click", () => {
		let table = document.getElementsByClassName('events_table')[0];
        
		let columnIdx = Array.prototype.indexOf.call(columnNo.parentElement.children, columnNo);
		let flag = columnNo.classList.contains("th-ascending");

		sortTable(table, columnIdx, !flag);
	});
});
}

/*
CREDITS:-
Sorting code-snippets inspired from: https://dcode.domenade.com/tutorials/how-to-easily-sort-html-tables-with-css-and-javascript
*/

function sortTable(table, col, ascending = true) {
	let flag;

    if(ascending)
        flag = 1
    else 
        flag = -1
    
	let t_body = table.tBodies[0];
	let rows = Array.from(t_body.querySelectorAll("tr"));

	const sortedRows = rows.sort((a, b) => {
		const column_a = a.querySelector(`td:nth-child(${col + 1})`).textContent.trim();
		const column_b = b.querySelector(`td:nth-child(${col + 1})`).textContent.trim();
		return column_a > column_b ? flag : -flag;
	});

    t_body.innerHTML = ""
	t_body.append(...sortedRows);

	table.querySelectorAll("th").forEach(th => th.classList.remove("th-ascending", "th-descending"));
	table.querySelector(`th:nth-child(${col + 1})`).classList.toggle("th-ascending", ascending);
	table.querySelector(`th:nth-child(${col + 1})`).classList.toggle("th-descending", !ascending);
}
