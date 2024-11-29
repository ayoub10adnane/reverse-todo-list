const taskController = require('../../controllers/taskController');
const Task = require('../../models/Task');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/Task');

describe('Task Controller - createTask', () => {
    it('should create a new task', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { description: 'Test Task' },
        });
        const res = httpMocks.createResponse();

        Task.prototype.save = jest.fn().mockResolvedValue(true);

        await taskController.createTask(req, res);

        expect(res.statusCode).toBe(201);
        // expect the response to have JSON data
        expect(res._getJSONData()).toEqual(true);
    });
});
