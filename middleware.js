// middlewares.js
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.status(401).send('Não autenticado');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    return res.status(403).send('Acesso restrito');
}

module.exports = { isAuthenticated, isAdmin };
