const output = document.getElementById("output");
const btnInsecure = document.getElementById("btn-insecure");
const btnSecure = document.getElementById("btn-secure");

async function callApi(endpoint) {
    output.textContent = "Lade...";

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        output.textContent = JSON.stringify(
            {
                httpStatus: response.status,
                ...data,
            },
            null,
            2,
        );
    } catch (error) {
        output.textContent = `Fehler: ${error.message}`;
    }
}

btnInsecure.addEventListener("click", () => callApi("/api/insecure-example"));
btnSecure.addEventListener("click", () => callApi("/api/secure-example"));
