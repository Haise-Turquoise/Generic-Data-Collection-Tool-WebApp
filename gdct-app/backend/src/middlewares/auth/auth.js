import AppError from '../../utils/AppError';
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
}

export const authorized = async (req, res, next) => {
  // Updated on Nov 30, 2020
  // Added req.body.user === google for requests from Appscript
  // Temporary measure
  if (!req.user && !(req.body.user === 'google')) {
    return next(new AppError('Bad Request', 401));
  }

  const isAdmin = Boolean(req.session.isAdmin);
  if (isAdmin) {
    return next();
  }
  console.log('auth-sessions:', req.session.resources);
  if (req.session.resources) {
    const urls = req.session.resources.map(e => e.resourcePath.toLowerCase());
    if (!urls.includes(req.originalUrl.toLowerCase())) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    for (const url of urls) {
      if (req.originalUrl.toLowerCase().includes(url)) {
        return next();
      }
    }
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};
