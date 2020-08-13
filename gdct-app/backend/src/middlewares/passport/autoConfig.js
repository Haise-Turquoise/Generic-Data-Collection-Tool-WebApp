import customStrategy from 'passport-custom';
import passport from 'passport';
import mongoose from 'mongoose';
import os from 'os';
import UserModel from '../../models/User/model';

const CustomStrategy = customStrategy.Strategy;

module.exports = () => {
  passport.use(
    'auto',
    new CustomStrategy(function (req, done) {
      process.nextTick(function () {
        const temp = mongoose.Types.ObjectId('5efb8b638464c20f646049a6');
        const uname = os.userInfo().username;
        UserModel.find({ AppConfig: temp }, function (err, user1) {
          user1.forEach(obj => {
            if (obj.username === uname) {
              req.session.user = obj.email;
              return done(null, { email: obj.email });
            }
            return done(null, false, { errors: { 'auto login': 'failed' } });
          });
        });
      });
    }),
  );
};
