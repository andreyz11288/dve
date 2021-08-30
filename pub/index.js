const hamburger = document.getElementsByClassName('header-hamburger')
const hamburgerModal = document.getElementsByClassName('modal-header-hamburger')
const scrolUp = document.getElementsByClassName('divUp')

const removeClassName = () => {
    hamburger[0].classList.remove('active')
    hamburgerModal[0].classList.remove('act')
    //   bodyClassName.classList.remove('overflow')
}
const addClassName = () => {
    hamburger[0].classList.add('active')
    hamburgerModal[0].classList.add('act')
    //   bodyClassName.classList.add('overflow')
}

const modalWind = () => {
    if (hamburger[0].classList.contains('active')) {
        removeClassName()
    } else {
        addClassName()
    }
}
hamburger[0].addEventListener('click', modalWind)
hamburger[0].addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        modalWind()
    }
    if (e.keyCode === 27) {
        removeClassName()
    }
})

document.addEventListener('scroll', () => {
    if (window.pageYOffset > 10) {
        scrolUp[0].classList.add('act')
    } else {
        scrolUp[0].classList.remove('act')
    }
})
function ScrollUp() {
    let scrollHedth = window.pageYOffset

  const upscrollFunc = setInterval(function () {
      if (scrollHedth > 0) {
          window.scroll(0, (scrollHedth -= 20))
      } else {
          clearInterval(upscrollFunc)
      }
  })
}
scrolUp[0].addEventListener('click', ScrollUp)