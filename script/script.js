// меню

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

// открытие, закрытие меню

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu')
  hamburger.classList.toggle('open')
})

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu')
    hamburger.classList.remove('open')
  }
})

leftMenu.addEventListener('click', (event) => {
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active')
    leftMenu.classList.add('openMenu')
    hamburger.classList.add('open')
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
// document.querySelectorAll('.tv-card__img').forEach(item => {
//   item.addEventListener('mouseenter', () => {
// src = item.src
// debugger
//   item.src = item.dataset.backdrop
// })
// item.addEventListener('mouseleave', () => )
// })

// открытие модального окна

tvShowsList.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    document.body.style.overflow = 'hidden'
    modal.classList.remove('hide')
  }
})

// закрытие модального окна

modal.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal') || event.target.closest('.cross')) {
    document.body.style.overflow = '';
    modal.classList.add('hide')
  }
})
