import { TaskService } from '../task.service';
import { TaskPriority, TaskStatus } from '../task.model';
import { Types } from 'mongoose';

// ✅ hoist-safe mock
jest.mock('../task.repository', () => ({
  TaskRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    findForUser: jest.fn(),
  },
}));

import { TaskRepository } from '../task.repository';

describe('TaskService – critical business logic', () => {
  let io: any;
  let notificationService: any;
  let taskService: TaskService;

  const creatorId = '64b000000000000000000001';
  const assignedToId = '64b000000000000000000002';
  const newAssignedToId = '64b000000000000000000003';

  beforeEach(() => {
    io = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };

    notificationService = {
      notify: jest.fn(),
    };

    taskService = new TaskService(io, notificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TEST 1
  it('creates a task and sends assignment notification', async () => {
    (TaskRepository.create as jest.Mock).mockResolvedValue({
      _id: new Types.ObjectId(),
      title: 'Test Task',
    });

    await taskService.createTask(creatorId, {
      title: 'Test Task',
      dueDate: new Date().toISOString(),
      priority: TaskPriority.HIGH,
      assignedToId,
    });

    expect(TaskRepository.create).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalledWith(
      assignedToId,
      'You were assigned a task: Test Task'
    );
  });

  // ✅ TEST 2
  it('emits real-time event when task is updated', async () => {
    const taskId = new Types.ObjectId().toString();

    (TaskRepository.findById as jest.Mock).mockResolvedValue({
      _id: taskId,
      title: 'Task',
      creatorId: new Types.ObjectId(creatorId),
      assignedToId: new Types.ObjectId(assignedToId),
    });

    (TaskRepository.updateById as jest.Mock).mockResolvedValue({
      _id: taskId,
      status: TaskStatus.IN_PROGRESS,
    });

    await taskService.updateTask(
      taskId,
      creatorId,
      { status: TaskStatus.IN_PROGRESS }
    );

    expect(io.emit).toHaveBeenCalledWith(
      'task:updated',
      expect.any(Object)
    );
  });

  // ✅ TEST 3
  it('notifies new assignee when task is reassigned', async () => {
    const taskId = new Types.ObjectId().toString();

    (TaskRepository.findById as jest.Mock).mockResolvedValue({
      _id: taskId,
      title: 'Reassign Task',
      creatorId: new Types.ObjectId(creatorId),
      assignedToId: new Types.ObjectId(assignedToId),
    });

    (TaskRepository.updateById as jest.Mock).mockResolvedValue({
      _id: taskId,
    });

    await taskService.updateTask(
      taskId,
      creatorId,
      { assignedToId: newAssignedToId }
    );

    expect(notificationService.notify).toHaveBeenCalledWith(
      newAssignedToId,
      'You were assigned a task: Reassign Task'
    );
  });
});
