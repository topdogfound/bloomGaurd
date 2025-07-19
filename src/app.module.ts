import { Module } from '@nestjs/common';
import { OrganizationModule } from './v1/organization/organization.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGO_URI ?? '';
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not set');
}

@Module({
  imports: [MongooseModule.forRoot(mongoUri), OrganizationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
