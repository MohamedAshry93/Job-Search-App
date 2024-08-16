import { systemRoles } from "../../Utils/system-roles.utils.js";

const { USER, COMPANY_HR } = systemRoles;

const roles = {
  JOB_ROLES_HR: [COMPANY_HR],
  JOB_ROLES_HR_USER: [USER, COMPANY_HR],
  JOB_ROLES_USER: [USER],
};

export default roles;
