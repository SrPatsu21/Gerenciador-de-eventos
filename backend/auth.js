// auth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.serializeUser((user, done) => {
  done(null, user.id); // salva o ID na sessão
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM USERS WHERE id = ?', [id], (err, row) => {
    done(err, row);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  const email = emails[0].value;

  db.get('SELECT * FROM USERS WHERE google_id = ?', [id], (err, user) => {
    if (err) return done(err);
    if (user) return done(null, user);

    db.run(
      'INSERT INTO USERS (google_id, name, email) VALUES (?, ?, ?)',
      [id, displayName, email],
      function (err) {
        if (err) return done(err);
        db.get('SELECT * FROM USERS WHERE id = ?', [this.lastID], (err, newUser) => {
          return done(err, newUser);
        });
      }
    );
  });
}));
