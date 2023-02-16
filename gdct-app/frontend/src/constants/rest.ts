const PORT = 3000;
const BACKEND_LOCAL = `http://localhost:${PORT}`;

// export const SERVER_APP = process.env.NODE_ENV === "production" ? process.env.SERVER_URL : BACKEND_LOCAL;
export const SERVER_APP = process.env.SERVER_URL || BACKEND_LOCAL;

/* Route groups and routes - separated by auth or security */
export const REST_GROUP_PUBLIC = '/public';
export const REST_PUBLIC_LOGIN = '/login';
export const REST_PUBLIC_REGISTER = '/register';
export const REST_PUBLIC_DATA = '/data';

export const REST_GROUP_VERIFICATION = '/verification';
export const REST_VERIFICATION_VERIFICATION = '/verification';

export const REST_GROUP_AUTH = '/jwt';
export const REST_AUTH_RECONNECT = '/reconnect';
export const REST_AUTH_LOGOUT = '/logout';

export const REST_GROUP_ADMIN = '/admin';

export const REST_GROUP_ADMIN_USER = `${REST_GROUP_ADMIN}/user_manager`;
export const REST_ADMIN_USERS = '/users';
export const REST_ADMIN_REGISTRATIONS = '/registrations';

export const REST_GROUP_ADMIN_ORGANIZATION = `${REST_GROUP_ADMIN}/organization_manager`;
export const REST_ADMIN_ORGANIZATIONS = '/organizations';

export const REST_GROUP_ADMIN_SECTOR = `${REST_GROUP_ADMIN}/sector_manager`;
export const REST_ADMIN_SECTORS = '/sectors';

export const REST_GROUP_ADMIN_TEMPLATE = `${REST_GROUP_ADMIN}/template_manager`;
export const REST_ADMIN_TEMPLATES = '/templates';

export const REST_GROUP_ADMIN_BUNDLE = `${REST_GROUP_ADMIN}/bundle_manager`;
export const REST_ADMIN_BUNDLES = '/bundles';

export const REST_GROUP_ADMIN_DATA_ENTITY = `${REST_GROUP_ADMIN}/data_entity_manager`;
export const REST_ADMIN_BUSINESS_CONCEPTS = '/business_concepts';
export const REST_ADMIN_GROUPS = '/groups';

export const REST_GROUP_ADMIN_EDIT_BUNDLE = `${REST_GROUP_ADMIN}/edit_bundle_manager`;
export const REST_ADMIN_EDIT_BUNDLES = '/edit_bundles';

export const REST_GROUP_ADMIN_REVIEW_BUNDLE = `${REST_GROUP_ADMIN}/review_bundle_manager`;
export const REST_ADMIN_REVIEW_BUNDLES = '/review_bundles';

export const REST_GROUP_ADMIN_APPROVE_BUNDLE = `${REST_GROUP_ADMIN}/approve_bundle_manager`;
export const REST_ADMIN_APPROVE_BUNDLES = '/approve_bundles';

export const REST_ADMIN_BUNDLES_WORKFLOW = `${REST_ADMIN_BUNDLES}/workflow`;

// HTTP error codes
export const HTTP_ERROR_INVALID_TOKEN = 401;
export const HTTP_ERROR_UNAUTHORIZED = 403;
