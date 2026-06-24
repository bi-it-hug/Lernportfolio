const express = require('express');
const session = require('express-session');
const path = require('path');
const header = require('./fw/header');
const footer = require('./fw/footer');
const login = require('./login');
const index = require('./index');
const adminUser = require('./admin/users');
const editTask = require('./edit');
const saveTask = require('./savetask');
const search = require('./search');
const searchProvider = require('./search/v2/index');
const deleteTask = require('./delete');
const { csrfMiddleware } = require('./fw/csrf');
const register = require('./register');
const history = require('./history');
const changePassword = require('./changepassword');
const deleteAccount = require('./deleteaccount');

const app = express();
const PORT = 3000;

app.use(session({
    secret: process.env.SESSION_SECRET || 'M183_lb2_s3ssion_s3cr3t_2024!',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'strict' }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self';"
    );
    next();
});

app.use(csrfMiddleware);

app.get('/', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await index.html(req), req));
});

app.post('/', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await index.html(req), req));
});

app.get('/admin/users', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    if (!isAdmin(req)) return res.redirect('/');
    res.send(await wrapContent(await adminUser.html(req), req));
});

app.get('/edit', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await editTask.html(req), req));
});

app.get('/delete', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    await deleteTask.handle(req);
    res.redirect('/');
});

app.get('/login', async (req, res) => {
    if (activeUserSession(req)) return res.redirect('/');
    res.send(await wrapContent(login.getLoginForm(req), req));
});

app.post('/login', async (req, res) => {
    const content = await login.handleLogin(req, res);
    if (content.user.userid !== 0) {
        login.startUserSession(req, res, content.user);
    } else {
        res.send(await wrapContent(content.html, req));
    }
});

app.get('/register', async (req, res) => {
    if (activeUserSession(req)) return res.redirect('/');
    res.send(await wrapContent(await register.handleRegister(req), req));
});

app.post('/register', async (req, res) => {
    if (activeUserSession(req)) return res.redirect('/');
    res.send(await wrapContent(await register.handleRegister(req), req));
});

app.get('/history', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await history.getHtml(req), req));
});

app.get('/change-password', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await changePassword.handleChangePassword(req), req));
});

app.post('/change-password', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await changePassword.handleChangePassword(req), req));
});

app.get('/delete-account', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await deleteAccount.handleDeleteAccount(req, res), req));
});

app.post('/delete-account', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    const html = await deleteAccount.handleDeleteAccount(req, res);
    if (html) res.send(await wrapContent(html, req));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.post('/savetask', async (req, res) => {
    if (!activeUserSession(req)) return res.redirect('/login');
    res.send(await wrapContent(await saveTask.html(req), req));
});

app.post('/search', async (req, res) => {
    if (!activeUserSession(req)) return res.status(401).send('Unauthorized');
    res.send(await search.html(req));
});

app.get('/search/v2/', async (req, res) => {
    if (!activeUserSession(req)) return res.status(401).send('Unauthorized');
    res.send(await searchProvider.search(req));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

async function wrapContent(content, req) {
    const headerHtml = await header(req);
    return headerHtml + content + footer;
}

function activeUserSession(req) {
    return req.session && req.session.userid;
}

function isAdmin(req) {
    return req.session && req.session.role === 'Admin';
}
