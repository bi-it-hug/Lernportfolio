function handleScroll() {
    let backgroundOffset = window.scrollY * parallaxSpeed
    parallaxElement.style.top = `${backgroundOffset}px`
}
