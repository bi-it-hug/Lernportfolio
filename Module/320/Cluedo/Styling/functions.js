function handleScroll() {
    let backgroundOffset = window.scrollY * parallaxSpeed
    parallax.style.backgroundPositionY = `${backgroundOffset}px`
}
