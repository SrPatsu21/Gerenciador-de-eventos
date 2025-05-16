const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./event-manager.db');

const schemaPath = path.join(__dirname, 'models', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error('Erro ao criar as tabelas:', err.message);
        } else {
            console.log('Tabelas criadas com sucesso.');
        }
    });
});

module.exports = db;