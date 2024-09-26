const body = document.body
let toggle = false

let toggleClass = () => {
    toggle = !toggle
    const toggleTest = `<div class="toggle-test ${toggle ? 'bi bi-brightness-high fs-3' : 'bi bi-brightness-high-fill fs-3'}"></div>`
    body.innerHTML = toggleTest
}

toggleClass()
body.addEventListener('click', toggleClass)
