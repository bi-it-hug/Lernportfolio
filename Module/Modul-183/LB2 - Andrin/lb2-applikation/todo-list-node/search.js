const searchProvider = require('./search/v2/index');

async function getHtml(req) {
    if (req.body.terms === undefined) {
        return 'Not enough information provided';
    }

    return await searchProvider.search({
        session: req.session,
        query: { terms: req.body.terms }
    });
}

module.exports = { html: getHtml };
