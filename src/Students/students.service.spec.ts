import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('StudentsService', () => {
  let service: StudentsService;
  let mockRepository: MockRepository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    mockRepository = module.get<MockRepository<Student>>(getRepositoryToken(Student));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a student', async () => {
      const createStudentDto = { name: 'John Doe', age: 20, department: 'Math' };
      mockRepository.create.mockImplementation(dto => dto);
      mockRepository.save.mockResolvedValue(createStudentDto);

      expect(await service.create(createStudentDto)).toEqual(createStudentDto);
      expect(mockRepository.create).toHaveBeenCalledWith(createStudentDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const studentArray = [{ name: 'John Doe', age: 20, department: 'Math' }];
      mockRepository.find.mockResolvedValue(studentArray);

      expect(await service.findAll()).toEqual(studentArray);
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      const student = { id: 1, name: 'John Doe', age: 20, department: 'Math' };
      mockRepository.findOneBy.mockResolvedValue(student);

      expect(await service.findOne(1)).toEqual(student);
    });

    it('should throw NotFoundException if student not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateStudentDto = { name: 'Jane Doe' };
      const student = { id: 1, name: 'John Doe', age: 20, department: 'Math' };
      mockRepository.findOneBy.mockResolvedValue(student);
      mockRepository.save.mockResolvedValue({ ...student, ...updateStudentDto });

      expect(await service.update(1, updateStudentDto)).toEqual({ ...student, ...updateStudentDto });
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1); // This should not throw
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no student was removed', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
