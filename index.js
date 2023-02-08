const drawBtn = document.getElementById('draw-btn')
let inputEl = document.getElementById('movie')
const movieEl = document.getElementById('movie-div')
const alert = document.querySelector('.placeholder')
const movieWatchlist = document.getElementById('movie-watchlist')
const savedMoviesContainer = document.getElementById('movies-container')
let watchlist = []
let mainDataArray = []
if (localStorage.getItem('watchlist')) {
    watchlist = JSON.parse(localStorage.getItem('watchlist'))
}


// listen for clicks both on the searchbtn and watchlsit

/**
 * mainDataArray awaits the response from the getMovie promise so as for it to run and it takes that response as its value hence it being the array we generated  from the getMovie function
 *
 */
document.addEventListener('click', async e => {
    if (e.target === drawBtn) {
        loading()
        let fetch = await fetchAPI(inputEl.value)
        if (fetch) {
            mainDataArray = await getMovie(fetch)
            movieEl.innerHTML = render(mainDataArray)
            inputEl.value = ''
        } else {
            alert.innerHtml = `<p>
			Unable to find waht you're looking for please try another search
			</p>`
        }
    } else if (e.target.dataset.id) {
        console.log(e.target)
        if (!document.getElementById('watchlist')) {
            handleWatchlist(e.target)
        } else {
            deleteWatchlist(e.target)
        }
        setTimeout(() => {
            watchlistRender()
        }, 1500)
    }
})

function returnObj(id) {
    return mainDataArray.filter(item => item.imdbID === id)[0]
}

function handleWatchlist(target) {
    id = target.dataset.id
    if (!watchlist.some(watch => watch.imdbID == returnObj(id).imdbID)) {
        watchlist.push(returnObj(id))
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
        target.innerHTML = '<i class="fa-solid fa-check"></i>  Added'
    } else {
        deleteWatchlist(target)
    }
}

// save to local storage when then add button is clicked


// add or remove btn
function rmOrAdd(movie) {
    let button = `<i class="fa-solid fa-circle-plus"></i> Watchlist`
    for (let watch of watchlist) {
        if (movie.imdbID == watch.imdbID) {
            button = `<i class="fa-solid fa-circle-minus"></i>  Remove`
        }
    }
    return button
}

// loading animation function
const loading = () => alert.innerHTML = `<p>Loading</p>`

// fetch data from the omdb API using the user input
async function fetchAPI(input) {
    let res = await fetch(`http://www.omdbapi.com/?s=${input}&apikey=4b54834`)
    let data = await res.json()
    let mainDataArray = data.Search
    return mainDataArray
}

// get movie data using the movie ID
async function getMovie(data) {
    let movieArray = []
    for (theMovie of data) {
        let res = await fetch(`https://www.omdbapi.com/?i=${theMovie.imdbID}&apikey=4b54834`)
        let data = await res.json()
        movieArray.push(data)
    }
    return movieArray
}

// get the movie html
function render(mainDataArray) {
    let html = ""
    for (let movie of mainDataArray) {
        html += `
		<section class="movie-div">
			<img src="${movie.Poster}" class="image">
			<h2 class="title">${movie.Title}
				<span class="rating">
                <i class="fa-solid fa-star"></i>
                ${movie.imdbRating}
                </span>
			</h2>
			<p class="duration">${movie.Runtime}</p>
			<p class="genre">${movie.Genre}</p>
			 <p class='add-btn'  data-id=${movie.imdbID}>
                ${rmOrAdd(movie)}
            </p>
			<p class="movie-desc">${movie.Plot}</p>
			<hr class="seperator">
		</section>
	`
    }

    return html
}

function deleteWatchlist(target) {
    id = target.dataset.id
    let index = watchlist.indexOf(returnObj(id))
    watchlist.splice(index, 1)
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    target.innerHTML = `<i class="fa-solid fa-check"></i> Removed`
}



function emptyWatchlist() {
    if (document.getElementById('watchlist').innerHTML.trim() === '') {
        document.getElementById('watchlist').innerHTML = `
        <div class="placeholder">
            <p> Your watchlist looks empty </p>
            <span class="watchlist-add">
                <a href="index.html"><i class="fa-solid fa-circle-plus"></i> Lets add some movies</a>
            </span>
        </div>
        `
    }
}

function watchlistRender() {
    if (document.getElementById('watchlist')) {
        document.getElementById('watchlist').innerHTML = render(watchlist)
        emptyWatchlist()
    } else {
        movieEl.innerHTML = render(mainDataArray)
    }
}

function renderWatchlist() {
    if (document.getElementById('watchlist')) {
        watchlist = JSON.parse(localStorage.getItem('watchlist'))
        if (watchlist.length == 0) {
            emptyWatchlist()
        } else {
            document.getElementById('watchlist').innerHTML = render(watchlist)
        }
    }
}



renderWatchlist()
