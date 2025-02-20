const header = {
    element: document.querySelector('header'),
    threshold: 100,
}

const parallax = {
    element: document.getElementById('parallax'),
    speed: 0.8,
}

function handleScroll() {
    parallax.element.style.top = `${window.scrollY * parallax.speed}px`
    window.scrollY > header.threshold ? header.element.classList.add('pip') : header.element.classList.remove('pip')
}

window.addEventListener('scroll', handleScroll)
