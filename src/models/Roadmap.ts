import mongoose, { Schema, Document } from 'mongoose';
import { Roadmap as RoadmapType } from '@/types';

export interface RoadmapDocument extends Omit<RoadmapType, 'id'>, Document {
  id: string;
}

const TopicResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['doc', 'video', 'practice'], default: 'doc' },
  },
  { _id: false }
);

const RoadmapTopicSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['core', 'framework', 'database', 'integration', 'project', 'interview', 'dsa'],
      default: 'core',
    },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    estimatedHours: { type: Number, default: 2 },
    resources: [TopicResourceSchema],
    isProject: { type: Boolean, default: false },
    isInterviewQuestion: { type: Boolean, default: false },
  },
  { _id: false }
);

const RoadmapSubSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    topics: [RoadmapTopicSchema],
  },
  { _id: false }
);

const RoadmapSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, required: true },
    subSections: [RoadmapSubSectionSchema],
    topics: [RoadmapTopicSchema],
  },
  { _id: false }
);

const RoadmapSchema = new Schema<RoadmapDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    estimatedWeeks: { type: Number, default: 12 },
    totalTopicsCount: { type: Number, default: 0 },
    sections: [RoadSectionSchema(RoadmapSectionSchema)],
  },
  {
    timestamps: true,
  }
);

function RoadSectionSchema(schema: any) {
  return schema;
}

export const RoadmapModel = mongoose.models.Roadmap || mongoose.model<RoadmapDocument>('Roadmap', RoadmapSchema);
