function calculatePrice(basePrice, specialPrice, extraPrice, extras, discount) {
    let addonDiscount
    let result

    if (extras >= 5) {
        addonDiscount = 10

    } else if (extras >= 3) {
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

    let price1 = calculatePrice(20000, 1500, 3000, 2, 5)
    let expected1 = 20000 * 0.95 + 1500 + 3000
    if (price1 !== expected1) {
        console.log(`Test 1 fehlgeschlagen: ${price1} !== ${expected1}`)
        testOk = false
    }

    let price2 = calculatePrice(20000, 1500, 3000, 3, 5)
    let expected2 = 20000 * 0.95 + 1500 + 3000 * 0.9
    if (price2 !== expected2) {
        console.log(`Test 2 fehlgeschlagen: ${price2} !== ${expected2}`)
        testOk = false
    }

    let price3 = calculatePrice(20000, 1500, 3000, 5, 5)
    let expected3 = 20000 * 0.95 + 1500 + 3000 * 0.85
    if (price3 !== expected3) {
        console.log(`Test 3 fehlgeschlagen: ${price3} !== ${expected3}`)
        testOk = false
    }

    if (testOk) console.log("Alle Tests erfolgreich!")
    return testOk
}

testCalculatePrice()
