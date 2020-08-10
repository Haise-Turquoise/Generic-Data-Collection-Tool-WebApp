import passportLocal from 'passport-local';
import passport from 'passport';
import UserModel from '../../models/User/model';

const LocalStrategy = passportLocal.Strategy;

module.exports = () => {
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        if (email) email = email.toLowerCase();
        process.nextTick(function () {
          UserModel.findOne({ email })
            .then(user => {
              if (!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
              }
              req.session.user = user.email;
              return done(null, { email: user.email });
            })
            .catch(done);
        });
      },
    ),
  );
};
