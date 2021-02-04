import 'jest';
import { request } from '../../config/HTTP';

describe('Template lifecycle', () => {
  let statusCreated;
  let templateTypeCreated;
  let userCreated;
  let templateCreated;

  // Create status and template type
  beforeAll(async done => {
    const mockStatus = {
      name: 'Draft',
      description: 'Represents an item which is not finalized or not ready for production',
      isActive: true,
    };

    const mockTemplateType = {
      name: 'Hospital Budget Request',
      description: '',
      programIds: [],
      isApprovable: true,
      isReviewable: true,
      isSubmittable: true,
      isInputtable: true,
      isViewable: true,
      isReportable: true,
    };

    const mockUser = {
      username: 'Lemonalf',
      email: 'lemon@hotmail.com',
      title: 'Student',
      firstName: 'Alfred',
      lastName: 'Lemon',
      phoneNumber: '949-932-1929',
      organizations: [],
      isActive: true,
      isEmailVerified: true,
      isApproved: true,
      creationDate: new Date(),
      approvedDate: new Date(),
    };

    request
      .post('/designer/statuses')
      .send({ status: mockStatus })
      .then(res => {
        statusCreated = res.body.status;
      })
      .then(() => request.post('/designer/templateTypes').send({ templateType: mockTemplateType }))
      .then(res => {
        templateTypeCreated = res.body.templateType;
      })
      // .then(() => request.post('/root/users'))
      // .send({ user: mockUser })
      // .then((res) => {
      //   userCreated = res.body.status
      // })
      .then(() => done());
  });

  it('Template creation', done => {
    const mockTemplate = {
      name: 'Sample',
      templateData: {},
      templateTypeId: templateTypeCreated._id,
      // userCreatorId: userCreated._id,
      userCreatorId: null,
      creationDate: new Date(),
      expirationDate: new Date(),
      statusId: statusCreated._id,
    };

    request
      .post('/designer/templates')
      .send({ template: mockTemplate })
      .then(res => {
        const template = res.body.template;
        templateCreated = template;

        expect(templateCreated.name).toBe(mockTemplate.name);
        expect(templateCreated.templateData).toEqual(mockTemplate.templateData);
        expect(templateCreated.templateTypeId).toBe(mockTemplate.templateTypeId);
        expect(templateCreated.creationDate).toBe(mockTemplate.creationDate.toISOString());
        expect(templateCreated.expirationDate).toBe(mockTemplate.expirationDate.toISOString());
        expect(templateCreated.statusId).toBe(mockTemplate.statusId);
        // expect(templateCreated.userCreatorId).toBe(mockTemplate.userCreatorId)

        done();
      });
  });

  it('Template deletion', done => {
    done();
  });
});
