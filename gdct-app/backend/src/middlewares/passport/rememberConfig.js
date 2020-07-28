import passportRemember from 'passport-remember-me';
import passport from 'passport';
import UserModel from '../../models/User/model';

const RememberMeStrategy = passportRemember.Strategy;
module.exports = () => {
  const tokens = {};

  function saveRememberMeToken(token, uid, fn) {
    tokens[token] = uid;
    return fn();
  }

  function issueToken(user, done) {
    // TODO: what is utils?
    const token = ''; // utils.randomString(64);
    saveRememberMeToken(token, user.id, function (err) {
      if (err) {
        return done(err);
      }
      return done(null, token);
    });
  }

  function consumeRememberMeToken(token, fn) {
    const uid = tokens[token];
    // invalidate the single-use token
    delete tokens[token];
    return fn(null, uid);
  }

  passport.use(
    new RememberMeStrategy(function (token, done) {
      consumeRememberMeToken(token, function (err, uid) {
        if (err) {
          return done(err);
        }
        if (!uid) {
          return done(null, false);
        }

        UserModel.findById(uid, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    }, issueToken),
  );
};
