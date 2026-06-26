document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form")
    if (!form) {
        return
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault()

        const terms = document.getElementById("terms")?.value ?? ""
        const csrf =
            document.querySelector('meta[name="csrf-token"]')?.content ?? ""

        const msg = document.getElementById("msg")
        const result = document.getElementById("result")

        if (msg) msg.classList.remove("hidden")
        if (result) {
            result.textContent = ""
            result.classList.add("hidden")
        }

        const body = new URLSearchParams({ terms, _csrf: csrf })

        fetch("/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Search failed")
                }
                return response.text()
            })
            .then((data) => {
                if (result) {
                    result.textContent = data
                    result.classList.remove("hidden")
                }
                if (msg) msg.classList.add("hidden")
            })
            .catch(() => {
                if (result) {
                    result.textContent = "Search failed."
                    result.classList.remove("hidden")
                }
                if (msg) msg.classList.add("hidden")
            })
    })
})
