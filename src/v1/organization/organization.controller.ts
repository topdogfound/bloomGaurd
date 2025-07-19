import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
// import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
const imageFilter = (
  _req: any,
  file: { originalname: string },
  cb: (arg0: null, arg1: boolean) => void,
) => {
  const valid = ['.jpg', '.jpeg', '.png'].includes(
    extname(file.originalname).toLowerCase(),
  );
  console.log(`File ${file.originalname} is valid: ${valid}`);
  cb(null, valid);
};

const storage = (path: string) =>
  diskStorage({
    destination: (_req, _file, cb) => {
      const folder = `uploads/${path}`;
      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (_req, file, cb) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const id = uuidv4();
      cb(null, `${id}${extname(file.originalname)}`);
    },
  });

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: storage('images'),
      fileFilter: imageFilter,
    }),
  )
  async create(
    @UploadedFiles() imageFiles: Express.Multer.File[] | undefined,
    @Body() rawBody: Record<string, any>,
  ): Promise<any> {
    // Safely parse contactInfo if it is a JSON string
    if (
      rawBody &&
      typeof rawBody === 'object' &&
      typeof rawBody.contactInfo === 'string'
    ) {
      try {
        const parsedContactInfo: unknown = JSON.parse(rawBody.contactInfo);
        rawBody.contactInfo = parsedContactInfo as Record<string, unknown>;
      } catch {
        throw new BadRequestException('Invalid JSON format for contactInfo');
      }
    }

    const dto = plainToInstance(CreateOrganizationDto, {
      ...rawBody,
      images: imageFiles?.map((file) => file.path) ?? [],
    });

    await validateOrReject(dto);

    return this.organizationService.create(dto);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.organizationService.findById(id);
  // }
  @Get(':organizationId')
  async findByOrganizationId(@Param('organizationId') organizationId: string) {
    const org =
      await this.organizationService.findByOrganizationId(organizationId);
    if (!org) {
      throw new NotFoundException(
        `Organization with id ${organizationId} not found`,
      );
    }
    return org;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.organizationService.remove(id);
  // }
  @Delete(':organizationId')
  async removeByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    const org =
      await this.organizationService.removeByOrganizationId(organizationId);
    if (!org) {
      throw new NotFoundException(
        `Organization with id ${organizationId} not found`,
      );
    }
    return org;
  }
}
