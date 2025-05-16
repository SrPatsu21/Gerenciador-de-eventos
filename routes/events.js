// routes/events.js
const express = require('express');
const db = require('../db');
const { isAuthenticated, isAdmin } = require('../middlewares');

const router = express.Router();

// Criar evento (admin)
router.post('/', isAdmin, (req, res) => {
    const { title, description, date, location } = req.body;
    db.run(
        `INSERT INTO EVENTS (title, description, date, location, created_by)
            VALUES (?, ?, ?, ?, ?)`,
        [title, description, date, location, req.user.id],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Listar eventos
router.get('/', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM EVENTS', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Confirmar presença
router.post('/:id/confirm', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    db.run(
        `INSERT OR REPLACE INTO PARTICIPATIONS (user_id, event_id, confirmed)
            VALUES (?, ?, 1)`,
        [userId, eventId],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.send('Presença confirmada!');
        }
    );
});

// Marcar pagamento (participante)
router.post('/:id/pay', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    db.run(
        `UPDATE PARTICIPATIONS SET paid = 1 WHERE user_id = ? AND event_id = ?`,
        [userId, eventId],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.send('Pagamento confirmado!');
        }
    );
});

module.exports = router;