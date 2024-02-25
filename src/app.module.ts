import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from 'src/Students/students.module';
import { UsersModule } from './User/user.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true,
  }),
  StudentsModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
