const parallax = {
    element: document.getElementById('parallax'),
    speed: 0.8,
}

function handleScroll() {
    let backgroundOffset = window.scrollY * parallax.speed
    parallax.element.style.top = `${backgroundOffset}px`
}

window.addEventListener('scroll', handleScroll)
