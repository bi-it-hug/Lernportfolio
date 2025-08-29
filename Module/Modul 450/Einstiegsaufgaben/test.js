function calculatePrice(basePrice, specialPrice, extraPrice, extras, discount) {
    let addonDiscount
    let result

    if (extras >= 3) {
        addonDiscount = 10

    } else if (extras >= 5) {
        addonDiscount = 15

    } else {
        addonDiscount = 0
    }

    if (discount > addonDiscount) {
        addonDiscount = discount
    }

    result = basePrice / 100.0 * (100 - discount) + specialPrice + extraPrice / 100.0 * (100 - addonDiscount)

    return result
}

function testCalculatePrice() {
    let testOk = true

    const price1 = calculatePrice(20000, 1500, 3000, 2, 5)
    console.log(`Preis 1: ${price1}`)

    const price2 = calculatePrice(20000, 1500, 3000, 3, 5)
    console.log(`Preis 2: ${price2}`)

    const price3 = calculatePrice(20000, 1500, 3000, 6, 5)
    console.log(`Preis 3: ${price3}`)

    if (price1 <= 0 || price2 <= 0 || price3 <= 0) {
        testOk = false
    }

    if (price3 >= price2) {
        testOk = false
    }


    console.log(`Test OK? ${testOk}`)
}

testCalculatePrice()
