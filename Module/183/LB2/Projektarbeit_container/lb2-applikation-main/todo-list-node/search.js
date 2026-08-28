import { search as searchV2 } from "./search/v2/index.js"

export async function search(req) {
    if (!req.body.terms || typeof req.body.terms !== "string") {
        return "Not enough information provided"
    }

    req.query = {
        terms: req.body.terms.trim(),
    }

    return searchV2(req)
}
