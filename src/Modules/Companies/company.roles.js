import { systemRoles } from "../../Utils/system-roles.utils.js";

const { USER, COMPANY_HR } = systemRoles;

const roles = {
  COMPANY_ROLES_HR: [COMPANY_HR],
  COMPANY_ROLES_HR_USER: [USER, COMPANY_HR],
};

export default roles;
