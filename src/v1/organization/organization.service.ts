import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
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
    const existing = await this.organizationModel.findOne({
      organizationId: createDto.organizationId,
    });

    if (existing) {
      if (existing.isDeleted) {
        const updated = await this.organizationModel
          .findByIdAndUpdate(
            existing._id,
            {
              ...createDto,
              isDeleted: false,
            },
            { new: true },
          )
          .exec();

        if (!updated)
          throw new InternalServerErrorException(
            'Failed to restore organization',
          );
        return updated;
      } else {
        throw new ConflictException('Organization ID already exists');
      }
    }

    // Fresh creation
    const createdOrganization = new this.organizationModel({ ...createDto });
    return createdOrganization.save();
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find({ isDeleted: false }).exec();
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
    return this.organizationModel
      .findOne({ organizationId: organizationId, isDeleted: false })
      .exec();
  }
  async removeByOrganizationId(
    organizationId: string,
  ): Promise<Organization | null> {
    return this.organizationModel.findOneAndDelete({ organizationId }).exec();
  }
  async softDeleteByOrganizationId(
    organizationId: string,
  ): Promise<Organization | null> {
    return this.organizationModel.findOneAndUpdate(
      { organizationId },
      { isDeleted: true },
      { new: true },
    );
  }
}
