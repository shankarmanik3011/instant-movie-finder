const API_KEY = "b12c60";

function searchMovies() {
  let input = document.getElementById("searchInput").value.trim().toLowerCase();
  if (input === "") return;

  document.getElementById("recommendedMovies").style.display = "none";
  document.getElementById("recTitle").style.display = "none";

  document.getElementById("resultTitle").style.display = "block";
  document.getElementById("similarTitle").style.display = "block";

  let genre = null;

  if (input.includes("funny") || input.includes("light") || input.includes("comedy")) {
    genre = "comedy";
  } else if (input.includes("sad") || input.includes("emotional")) {
    genre = "drama";
  } else if (input.includes("action") || input.includes("thrill")) {
    genre = "action";
  } else if (input.includes("romantic") || input.includes("love")) {
    genre = "romance";
  } else if (input.includes("scary") || input.includes("horror")) {
    genre = "horror";
  }

  let query = genre ? genre : input;

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "False") {
        document.getElementById("movieList").innerHTML = "No movies found";
        return;
      }
      displayMovies(data.Search);
    });
}

function displayMovies(movies) {
  const list = document.getElementById("movieList");
  list.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${movie.Poster}">
      <p>${movie.Title}</p>
    `;
    div.onclick = () => showDetails(movie.imdbID);
    list.appendChild(div);
  });
}

function showDetails(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
      document.getElementById("modalDetails").innerHTML = `
        <h2>${movie.Title}</h2>
        <p><b>Rating:</b> ${movie.imdbRating}</p>
        <p><b>Genre:</b> ${movie.Genre}</p>
        <p><b>Actors:</b> ${movie.Actors}</p>
        <p><b>Plot:</b> ${movie.Plot}</p>
      `;
      openModal();
      fetchSimilar(movie.Genre.split(",")[0]);
    });
}

function fetchSimilar(genre) {
  fetch(`https://www.omdbapi.com/?s=${genre}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const sim = document.getElementById("similarMovies");
      sim.innerHTML = "";
      if (!data.Search) return;

      data.Search.slice(0, 5).forEach(m => {
        const d = document.createElement("div");
        d.className = "movie-card";
        d.innerHTML = `<p>${m.Title}</p>`;
        d.onclick = () => showDetails(m.imdbID);
        sim.appendChild(d);
      });
    });
}

function openModal() {
  document.getElementById("movieModal").style.display = "block";
}

function closeModal() {
  document.getElementById("movieModal").style.display = "none";
}

function loadRecommendations() {
  fetch(`https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const rec = document.getElementById("recommendedMovies");
      if (!data.Search) return;

      data.Search.slice(0, 6).forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie-card";
        div.innerHTML = `
          <img src="${movie.Poster}">
          <p>${movie.Title}</p>
        `;
        div.onclick = () => showDetails(movie.imdbID);
        rec.appendChild(div);
      });
    });
}

loadRecommendations();
