import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(createDto: CreateOrganizationDto): Promise<Organization> {
    const createdOrganization = new this.organizationModel({ ...createDto });

    return createdOrganization.save();
  }
  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find().exec();
  }
  async findById(id: string): Promise<Organization | null> {
    return this.organizationModel.findById(id).exec();
  }
  async remove(id: string): Promise<Organization | null> {
    console.log('Removing organization with ID:', id);
    return this.organizationModel.findByIdAndDelete(id).exec();
  }
  async findByOrganizationId(
    organizationId: string,
  ): Promise<Organization | null> {
    return this.organizationModel.findOne({ organizationId }).exec();
  }
  async removeByOrganizationId(
    organizationId: string,
  ): Promise<Organization | null> {
    return this.organizationModel.findOneAndDelete({ organizationId }).exec();
  }
}
