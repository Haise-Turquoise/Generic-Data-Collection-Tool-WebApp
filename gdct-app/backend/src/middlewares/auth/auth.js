import ErrorGDCT from '../../utils/errorGDCT';
import UserService from '../../services/User';
import AppRoleResourceService from '../../services/AppRoleResource';
import AppResourceService from '../../services/AppResource';

export default class Auth {
  constructor() {
    this.userService = new UserService();
    this.appRoleResourceService = new AppRoleResourceService();
    this.appResourceService = new AppResourceService();
  }

  async getResources(appSysRoleIds) {
    const res = [];
    for (const appSysRoleId of appSysRoleIds) {
      const appRoleResource = await this.appRoleResourceService.findAppRoleResource({
        appSysRoleId,
      });
      for (const _id of appRoleResource[0].resourceId) {
        const resource = await this.appResourceService.findAppResource({
          _id,
        });
        res.push(resource[0].resourcePath);
      }
    }
    return res;
  }

  // async authenticated(req, res, next) {
  //   let token = '';
  //   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  //     token = req.headers.authorization.split(' ')[1];
  //   } else if (req.cookies.jwt) {
  //     token = req.cookies.jwt;
  //   }

  //   if (!token) {
  //     return next(new ErrorGDCT('You are not logged in! Please log into get access.', 401));
  //   }

  //   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //   const currentUser = await this.userService.findById(decoded.id);
  //   if (!req.user) {
  //     return next(new ErrorGDCT('The user belonging to this token does no longer exist.', 401));
  //   }
  //   req.user = currentUser;
  //   next();
  // }
}

export const authorized = async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorGDCT('Bad Request', 401));
  }

  const isAdmin = Boolean(req.session.isAdmin);
  if (isAdmin) {
    return next();
  }

  if (req.session.resources) {
    const urls = req.session.resources.map(e => e.resourcePath.toLowerCase());
    // console.log('middle-auth-authorized-url:', req.originalUrl.toLowerCase());
    console.log('test-url:', urls, req.originalUrl);
    if (!urls.includes(req.originalUrl.toLowerCase())) {
      return next(new ErrorGDCT('You do not have permission to perform this action.', 403));
    }
  }

  next();
};
