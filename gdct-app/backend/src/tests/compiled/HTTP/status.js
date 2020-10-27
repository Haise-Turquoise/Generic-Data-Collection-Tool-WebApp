import 'jest';
import { request } from '../../config/HTTP';
import Status from '../../../entities/Status';

describe('Status lifecycle', () => {
  let statusCreated;

  it('Status creation', done => {
    const mockStatus = {
      name: 'Draft',
      description: 'Represents an item which is not finalized or not ready for production',
      isActive: true,
    };

    request
      .post('/designer/statuses')
      .send({ status: mockStatus })
      .then(res => {
        statusCreated = res.body.status;

        expect(res.status).toBe(200);

        expect(statusCreated.name).toBe(mockStatus.name);
        expect(statusCreated.description).toBe(mockStatus.description);
        expect(statusCreated.isActive).toBe(mockStatus.isActive);

        done();
      });
  });
});
