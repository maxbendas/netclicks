const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const modalLink = document.querySelector('.modal__link');
const description = document.querySelector('.description');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const preloader = document.querySelector('.preloader');
const dropdown = document.querySelectorAll('.dropdown');
const tvShowsHead = document.querySelector('.tv-shows__head');
const posterWrapper = document.querySelector('.poster__wrapper');
const modalContent = document.querySelector('.modal__content');
const pagination = document.querySelector('.pagination');
const trailer = document.querySelector('#trailer');
const trailerHead = document.querySelector('#trailer-head');

const loading = document.createElement('div');
loading.className = 'loading';

const DBService = class {

  constructor() {
    this.API_KEY = '57716a2cbd2bb762f9fd5296076abcff'
    this.SERVER = 'https://api.themoviedb.org/3'
  }

  getData = async (url) => {

    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  }
  getTestData = () => {
    return this.getData('test.json')
  }
  getTestCard = () => {
    return this.getData('card.json')
  }
  getSearchResult = query => {
    this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`
    return this.getData(this.temp)
  }

  getNextPage = page => {
    return this.getData(this.temp + '&page=' + page)
  }

  getTvShow = id => {
    return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`)
  }
  getTopRated = () => {
    return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`)
  }
  getPopular = () => {
    return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`)
  }
  getWeek = () => {
    return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`)
  }
  getToday = () => {
    return this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`)
  }
  getVideo = (id) => {
    return this.getData(`${this.SERVER}/tv/${id}/videos?api_key=${this.API_KEY}&language=ru-RU`)
  }


}

const dbService = new DBService();

const renderCard = (response, target) => {

  tvShowsList.textContent = '';

  console.log(response);
  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено...';
    tvShowsHead.style.cssText = 'color: red; border-bottom: 3px solid red;'
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска:';
  tvShowsHead.style.cssText = 'color: green;'


  response.results.forEach(item => {

    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id
    } = item;

    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote"> ${vote}</span> ` : '';

    const card = document.createElement('li');
    card.classList.add('tv-shows__item');

    card.innerHTML = `
  <a href="#" id="${id}" class="tv-card">
    ${voteElem}
<img class="tv-card__img"
  src="${posterIMG}"
  data-backdrop="${backdropIMG}"
  alt="${title}">
  <h4 class="tv-card__head">${title}</h4>
    </a>
`;
    loading.remove()
    tvShowsList.append(card);
  });

  // пагинация
  pagination.textContent = '';
  if (!target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class="pages">${i}</li>`
    }
  }
}
pagination.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains('pages')) {
    tvShows.append(loading);
    dbService.getNextPage(target.textContent).then(renderCard)
  }
})

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  if (value) {
    dbService.getSearchResult(value).then(renderCard);
  }
})

// открытие, закрытие меню

const closeDropdown = () => {
  dropdown.forEach(item => {
    item.classList.remove('active')
  })
}

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu')
  hamburger.classList.toggle('open')
  closeDropdown();
})

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu')
    hamburger.classList.remove('open')
    closeDropdown();
  }
})

leftMenu.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active')
    leftMenu.classList.add('openMenu')
    hamburger.classList.add('open')
  }

  if (target.closest('#top-rated')) {
    tvShows.append(loading);
    dbService.getTopRated().then((response) => renderCard(response, target))
  }

  if (target.closest('#popular')) {
    tvShows.append(loading);
    dbService.getPopular().then((response) => renderCard(response, target))
  }

  if (target.closest('#week')) {
    tvShows.append(loading);
    dbService.getWeek().then((response) => renderCard(response, target))
  }

  if (target.closest('#today')) {
    tvShows.append(loading);
    dbService.getToday().then((response) => renderCard(response, target))
  }

  if (target.closest('#search')) {
    tvShowsList.textContent = '';
    tvShowsHead.textContent = '';
  }

})

// смена карточки 

const changeImage = event => {
  const card = event.target.closest('.tv-shows__item')
  if (card) {
    const img = card.querySelector('.tv-card__img')

    if (img.dataset.backdrop) {
      [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop]
    }
  }

}
tvShowsList.addEventListener('mouseover', changeImage)
tvShowsList.addEventListener('mouseout', changeImage)

// открытие модального окна

tvShowsList.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {

    preloader.style.display = 'block';

    dbService.getTvShow(card.id)
      .then(data => {
        if (data.poster_path) {
          tvCardImg.src = IMG_URL + data.poster_path;
          tvCardImg.alt = data.name;
          posterWrapper.style.display = '';
          modalContent.style.paddingLeft = '';
        } else {
          posterWrapper.style.display = 'none';
          modalContent.style.paddingLeft = '25px';
        }
        // tvCardImg.src = IMG_URL + data.poster_path;
        // tvCardImg.alt = data.name;
        modalTitle.textContent = data.name;
        // REDUCE
        // genresList.innerHTML = data.genres.reduce((acc, item) => `${ acc } <li>${item.name}</li>`, '')
        genresList.textContent = '';
        // for (const item of data.genres) {
        //   genresList.innerHTML += `< li > ${ item.name }</ > `
        // }
        data.genres.forEach((item) => {
          genresList.innerHTML += `<li> ${item.name}</li> `
        })
        rating.textContent = data.vote_average;
        modalLink.href = data.homepage;
        description.textContent = data.overview;
        return data.id;
      })
      .then(dbService.getVideo)
      .then(data => {
        trailer.textContent = '';
        if (data.results.length) {
          trailerHead.classList.remove('hide')
          data.results.forEach((item) => {
            const treilerItem = document.createElement('li')
            treilerItem.innerHTML = `
          <iframe
            width="400"
            height="300"
            src="https://www.youtube.com/embed/${item.key}" frameborder="0"
            allowfullscreen>
          </iframe>
          <h4 style="padding-bottom: 30px">${item.name}</h4>
        `;
            trailer.append(treilerItem)
          })
        }
      })
      .then(() => {
        document.body.style.overflow = 'hidden'
        modal.classList.remove('hide')
      })
      .finally(() => {
        preloader.style.display = '';
      })
  }
})

// закрытие модального окна

modal.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal') || event.target.closest('.cross')) {
    document.body.style.overflow = '';
    modal.classList.add('hide')
  }
})