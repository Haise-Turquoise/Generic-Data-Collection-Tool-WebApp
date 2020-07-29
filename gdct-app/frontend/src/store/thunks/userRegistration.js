import organizationController from '../../controllers/organization';
import AppSysController from '../../controllers/AppSys';
import organizationGroupController from '../../controllers/organizationGroup';
import programController from '../../controllers/program';
import templateTypeController from '../../controllers/templateType';
import userController from '../../controllers/user';
import userRegistrationStore from '../userRegistrationStore/store';
import COATreesStore from '../COATreesStore/store';

const handleInputTemplate = (templateSet, submission) => {
  const templateType = {
    templateTypeId: '',
    templateCode: '',
  };
  let templateSelected = templateSet.find(function (element) {
    return element.templateTypeId === submission.submission._id;
  });

  if (templateSelected === undefined) {
    templateType.templateCode = submission.submission.name;
    templateType.templateTypeId = submission.submission._id;
    templateSelected = templateType;
    templateSet.push(templateSelected);
  }
};

const handleInputProgram = (programSet, submission) => {
  const program = {
    programId: '',
    programCode: '',
    template: [],
  };
  let programSelected = programSet.find(function (element) {
    return element.programId === submission.program.code;
  });

  if (programSelected === undefined) {
    program.programCode = submission.program.code;
    program.programId = submission.program._id;
    programSelected = program;
    programSet.push(programSelected);
  }

  handleInputTemplate(programSelected.template, submission);
};

const handleInputOrg = (organization, submission) => {
  const org = {
    orgId: '',
    program: [],
  };

  let organizationSelected = organization.find(function (element) {
    return element.orgId === submission.organization.id;
  });
  if (organizationSelected === undefined) {
    org.IsActive = false;
    org.orgId = submission.organization.id;
    org.name = submission.organization.name;
    org.authorizedPerson = submission.organization.authorizedPerson;
    organizationSelected = org;

    organization.push(organizationSelected);
  }

  handleInputProgram(organizationSelected.program, submission);
};

const checkPerission = submission => {
  const permission = [];
  if (submission.approve) permission.push('approve');
  if (submission.review) permission.push('review');
  if (submission.submit) permission.push('submit');
  if (submission.input) permission.push('input');
  if (submission.view) permission.push('view');
  if (submission.viewCongos) permission.push('viewCongos');
  return permission;
};

export default class RegisterService {
  getAppSys() {
    return AppSysController.fetch()
      .then(
        ({
          data: {
            data: { appSys },
          },
        }) => {
          const options = [];
          appSys.forEach(appSysOptions => {
            options.push({
              label: appSysOptions.name,
              value: { name: appSysOptions.name, _id: appSysOptions._id },
            });
          });

          return options;
        },
      )
      .catch(error => console.error(error));
  }

  getOrgGroup() {
    return organizationGroupController
      .fetch()
      .then(
        ({
          data: {
            data: { organizationGroups },
          },
        }) => {
          const options = [];
          organizationGroups.forEach(orgGroup => {
            options.push({
              label: orgGroup.name,
              value: { name: orgGroup.name, _id: orgGroup._id },
            });
          });

          return options;
        },
      )
      .catch(error => console.error(error));
  }

  getOrg(orgGroup) {
    return organizationController
      .fetchByOrgGroupId(orgGroup)
      .then(
        ({
          data: {
            data: { organizations },
          },
        }) => {
          const options = [];
          organizations.forEach(org => {
            options.push({
              label: `(${org.id})${org.name}`,
              value: org.id,
              information: {
                _id: org._id,
                name: org.name,
                id: org.id,
                orgGroupId: orgGroup,
                programId: org.programId,
                authorizedPerson: org.authorizedPerson,
              },
            });
          });
          return options;
          // dispatch(userRegistrationStore.actions.setUserOrganizations())
        },
      )
      .catch(error => console.error(error));
  }

  searchOrg(searchKey, reference, options) {
    return options[searchKey] === reference;
  }

  getProgram(programInfo) {
    const programId = [];
    programInfo.forEach(program => {
      programId.push(program.id);
    });

    return programController
      .fetchByIds(programId)
      .then(
        ({
          data: {
            data: { programs },
          },
        }) => {
          const options = [];
          programs.forEach(program => {
            const option = programInfo.find(element => element.id === program._id);
            options.push({
              label: `(${program.code})${program.name}`,
              value: program._id,
              information: {
                _id: program._id,
                name: program.name,
                code: program.code,
                org: option.org,
              },
            });
          });

          return options;
        },
      )
      .catch(error => console.error(error));
  }

  getTemplateType(userPrograms) {
    const programList = [];
    userPrograms.forEach(userProgram => {
      programList.push(userProgram._id);
    });
    return templateTypeController
      .fetchByProgramIds(programList)
      .then(
        ({
          data: {
            data: { templateTypes },
          },
        }) => {
          const submissionList = [];
          let index = 0;

          templateTypes.forEach(templateType => {
            const submission = userPrograms.find(element =>
              templateType.programId.includes(element._id),
            );
            console.log(submission);
            submissionList.push({
              organization: submission.org,
              program: { name: submission.name, code: submission.code, _id: submission._id },
              submission: { name: templateType.name, _id: templateType._id },
              approveAvailable: templateType.isApprovable,
              reviewAvailable: templateType.isReviewable,
              submitAvailable: templateType.isSubmittable,
              inputAvailable: templateType.isInputtable,
              viewAvailable: templateType.isViweable,
              viewCognosAvailable: templateType.isReportable,
              approve: false,
              review: false,
              submit: false,
              input: false,
              view: false,
              viewCognos: false,
              index,
            });
            index++;
          });
          return submissionList;
        },
      )
      .catch(error => console.error(error));
  }

  sendRegistrationData(registerData) {
    return userController.create(registerData).catch(error => console.error(error));
  }

  submissionChange(userSubmissions) {
    const permissionList = [];
    userSubmissions.forEach(submission => {
      const permission = checkPerission(submission);
      permission.forEach(permission => {
        permissionList.push({
          organization: submission.organization,
          program: submission.program,
          submission: submission.submission,
          permission,
          approve: submission.approve,
          review: submission.review,
          submit: submission.submit,
          view: submission.view,
          viewCongos: submission.viewCongos,
          input: submission.input,
        });
      });
    });
    return permissionList;
  }

  handleInputSysRole(data, permission, submission, userAppSys) {
    const sysRole = {
      appSys: '',
      role: '',
      org: [],
    };
    if (submission[permission]) {
      let sysRoleSelected = data.sysRole.find(function (element) {
        return element.role === permission;
      });
      if (sysRoleSelected === undefined) {
        sysRoleSelected = sysRole;
        sysRoleSelected.role = permission;
        sysRoleSelected.appSys = userAppSys.code;
        data.sysRole.push(sysRoleSelected);
      }
      handleInputOrg(sysRoleSelected.org, submission);
    }
  }
}
