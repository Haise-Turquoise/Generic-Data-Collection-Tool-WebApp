import passport from 'passport';
import UserModel from '../../models/User/model';

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
      done(err, user);
    });
  });
  require('./localConfig')();
  require('./rememberConfig')();
  require('./facebookConfig')();
  require('./googleConfig')();
};
