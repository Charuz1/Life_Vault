import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentModel extends Document {
  userId: mongoose.Types.ObjectId;
  familyMemberId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  category: string;
  tags: string[];
  ocrText?: string;
  issueDate?: Date;
  expiryDate?: Date;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    familyMemberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember' },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    category: { type: String, required: true, default: 'Uncategorized' },
    tags: [{ type: String }],
    ocrText: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Create text index for AI search
DocumentSchema.index({ title: 'text', description: 'text', tags: 'text', ocrText: 'text' });

export default mongoose.model<IDocumentModel>('Document', DocumentSchema);
