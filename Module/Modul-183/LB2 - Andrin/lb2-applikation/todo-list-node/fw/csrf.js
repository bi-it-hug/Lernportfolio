const crypto = require('crypto');

function csrfMiddleware(req, res, next) {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }

    if (req.method === 'POST') {
        const token = req.body._csrf;
        if (!token || token !== req.session.csrfToken) {
            return res.status(403).send('Invalid or missing CSRF token.');
        }
    }

    next();
}

module.exports = { csrfMiddleware };
