import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    // Mock StudentsService
    const mockStudentsService = {
      create: jest.fn((dto) => {
        return { id: Date.now(), ...dto };
      }),
      findAll: jest.fn(() => {
        return [{ id: 1, name: 'Test Student', age: 20, department: 'Engineering' }];
      }),
      findOne: jest.fn((id) => {
        return { id, name: 'Test Student', age: 20, department: 'Engineering' };
      }),
      update: jest.fn((id, dto) => {
        return { id, ...dto };
      }),
      remove: jest.fn((id) => {
        return { affected: 1 };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a student', async () => {
      const createStudentDto: CreateStudentDto = { name: 'New Student', age: 21, department: 'Science' };
      expect(await controller.create(createStudentDto)).toEqual({
        id: expect.any(Number),
        ...createStudentDto,
      });
      expect(service.create).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      expect(await controller.findAll()).toEqual([
        { id: 1, name: 'Test Student', age: 20, department: 'Engineering' },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      const id = 1;
      expect(await controller.findOne(id.toString())).toEqual({
        id,
        name: 'Test Student',
        age: 20,
        department: 'Engineering',
      });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateStudentDto: UpdateStudentDto = { name: 'Updated Student', age: 22 };
      const id = 1;
      expect(await controller.update(id.toString(), updateStudentDto)).toEqual({
        id,
        ...updateStudentDto,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateStudentDto);
    });
  });

 
});
