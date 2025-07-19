import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false }) // Embedded subdocument without its own _id
export class ContactInfo {
  @Prop() email?: string;
  @Prop() phone?: string;
  @Prop() address?: string;
}
export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
export type ContactInfoDocument = ContactInfo & Document;

@Schema()
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}
export const ImageSchema = SchemaFactory.createForClass(Image);
export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ unique: true, match: /^[A-Z]{4}\d{3}$/ })
  organizationId: string;

  @Prop({ required: true })
  organizationName: string;

  @Prop({ required: true })
  organizationType: string;

  @Prop({ type: ContactInfoSchema, default: {} })
  contactInfo?: ContactInfo;

  @Prop({ type: Types.ObjectId, ref: 'Image', required: false })
  logo?: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Image' }])
  images?: Types.ObjectId[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export type OrganizationDocument = Organization & Document;

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// 🔒 Remove internal fields globally in response
OrganizationSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    if ('__v' in ret) delete ret.__v;
    if ('isDeleted' in ret) delete ret.isDeleted;
    return ret;
  },
});
