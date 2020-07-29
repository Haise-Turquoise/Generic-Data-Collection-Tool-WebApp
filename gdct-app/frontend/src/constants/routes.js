export const ROUTE_ROOT = '/';

export const ROUTE_PUBLIC = `${ROUTE_ROOT}public`;
export const ROUTE_PUBLIC_LOGIN = `${ROUTE_PUBLIC}/login`;
export const ROUTE_PUBLIC_PREREGISTER = `${ROUTE_PUBLIC}/preregister`;
export const ROUTE_PUBLIC_REGISTER = `${ROUTE_PUBLIC}/register`;
export const ROUTE_PUBLIC_RECOVERY = `${ROUTE_PUBLIC}/recovery`;

export const ROUTE_USER = `${ROUTE_ROOT}user`;
export const ROUTE_USER_PROFILE = `${ROUTE_USER}/profile`;
export const ROUTE_USER_DASHBOARD = `${ROUTE_USER}/dashboard`;
export const ROUTE_USER_BUNDLES = `${ROUTE_USER}/bundles`;

export const ROUTE_VERIFICATION = `${ROUTE_ROOT}verification`;
export const ROUTE_VERIFICATION_VERIFICATION = `${ROUTE_VERIFICATION}/:_id`;

// Admin routes
export const ROUTE_ADMIN_ROOT = `${ROUTE_ROOT}admin`;

export const ROUTE_ADMIN_USER = `${ROUTE_ADMIN_ROOT}/user_manager`;
export const ROUTE_ADMIN_USER_USERS = `${ROUTE_ADMIN_USER}/users`;
export const ROUTE_ADMIN_USER_REGISTRATIONS = `${ROUTE_ADMIN_USER}/registrations`;

export const ROUTE_ADMIN_TEMPLATE = `${ROUTE_ADMIN_ROOT}/template_manager`;
export const ROUTE_ADMIN_TEMPLATE_TEMPLATES = `${ROUTE_ADMIN_TEMPLATE}/templates`;
export const ROUTE_ADMIN_TEMPLATE_TEMPLATE = `${ROUTE_ADMIN_TEMPLATE_TEMPLATES}/:_id`;

export const ROUTE_ADMIN_DATA_ENTITY = `${ROUTE_ADMIN_ROOT}/data_entity_manager`;
export const ROUTE_ADMIN_DATA_ENTITY_BUSINESS_CONCEPTS = `${ROUTE_ADMIN_DATA_ENTITY}/business_concepts`;
export const ROUTE_ADMIN_DATA_ENTITY_GROUPS = `${ROUTE_ADMIN_DATA_ENTITY}/groups`;

export const ROUTE_ADMIN_BUNDLE = `${ROUTE_ADMIN_ROOT}/bundle_manager`;
export const ROUTE_ADMIN_BUNDLE_BUNDLES = `${ROUTE_ADMIN_BUNDLE}/bundles`;

export const ROUTE_ADMIN_ORGANIZATION = `${ROUTE_ADMIN_ROOT}/organization_manager`;
export const ROUTE_ADMIN_ORGANIZATION_ORGANIZATIONS = `${ROUTE_ADMIN_ORGANIZATION}/organizations`;

export const ROUTE_ADMIN_LHIN = `${ROUTE_ADMIN_ROOT}/LHIN_manager`;
export const ROUTE_ADMIN_LHIN_LHIN = `${ROUTE_ADMIN_LHIN}/LHINs`;

export const ROUTE_ADMIN_SECTOR = `${ROUTE_ADMIN_ROOT}/sector_manager`;
export const ROUTE_ADMIN_SECTOR_SECTORS = `${ROUTE_ADMIN_SECTOR}/sectors`;

export const ROUTE_WORKFLOW = `${ROUTE_ROOT}admin/workflow`;
export const ROUTE_WORKFLOW_CREATE = `${ROUTE_WORKFLOW}/create`;

export const ROUTE_COLUMN_NAMES = `${ROUTE_ROOT}columnNames`;

export const ROUTE_TEMPLATE_PCKGS = '/admin/template';
export const ROUTE_TEMPLATE_PCKGS_PCKGS = `${ROUTE_TEMPLATE_PCKGS}/templatePackages`;
export const ROUTE_TEMPLATE_PCKGS_PCKG = `${ROUTE_TEMPLATE_PCKGS}/templatePackages/:_id`;
