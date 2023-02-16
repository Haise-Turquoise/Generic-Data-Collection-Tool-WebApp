//@ts-ignore
import passportLocal from 'passport-local';
import passport from 'passport';
import UserModel from '../../models/User/model';
import { Request} from 'express';
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
      function (req:Request, email:string, password:string, done:any) {
        if (email) email = email.toLowerCase();
        process.nextTick(function () {
          UserModel.findOne({ email })
          //@ts-ignore
            .then((user: { validatePassword: (arg0: string) => any; email: any; }|null) => {
              if (!user || !user.validatePassword(password)) {
                return done(null, false, { message: 'email or password is invalid' });
              }
              // @ts-ignore
              req.session.user = user.email;
              return done(null, { email: user.email });
            })
            .catch(done);
        });
      },
    ),
  );
};
