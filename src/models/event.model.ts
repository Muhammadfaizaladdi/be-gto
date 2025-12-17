import mongoose, { ObjectId } from "mongoose";

import * as Yup from 'yup'

export const EVENT_MODEL_NAME = "Event"
const Schema = mongoose.Schema

export const eventDAO = Yup.object({
    name: Yup.string().required(),
    startDate: Yup.string().required(),
    endDate: Yup.string().required(),
    description: Yup.string().required(),
    banner: Yup.string().required(),
    isFeatured: Yup.boolean().required(),
    isOnline: Yup.boolean().required(),
    isPublish: Yup.boolean(),
    category: Yup.string().required(),
    slug: Yup.string(),
    createdBy: Yup.string().required(),
    createdAt: Yup.string(),
    updateAt: Yup.string(),
    location: Yup.object().shape({
  region: Yup.number().required(),
  coordinates: Yup.array()
    .of(Yup.number())
    .length(2)
    .required(),
  address: Yup.string()
}).required(),

})

export type TypeEvent = Yup.InferType<typeof eventDAO>

export interface Event extends Omit<TypeEvent, 'category' | 'createdBy'>{
    category: ObjectId,
    createdBy: ObjectId
}


const eventSchema = new Schema<Event>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    startDate: {
        type: Schema.Types.String,
        required: true
    },
    endDate: {
        type: Schema.Types.String,
        required: true
    },
    banner: {
        type: Schema.Types.String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    isFeatured: {
        type: Schema.Types.Boolean,
        required: true
    },
    isOnline: {
        type: Schema.Types.Boolean,
        required: true
    },
    isPublish: {
        type: Schema.Types.Boolean,
        required: true,
        default: false
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    slug: {
        type: Schema.Types.String,
        unique: true
    },
    location: {
  type: {
    region: {
      type: Number,
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0]
    },
    address : {
        type: Schema.Types.String
    }
  },
  required: true
}



},{
    timestamps: true
}).index({name: "text"})


eventSchema.pre("save", function () {
    if (!this.slug) {
        const slug = this.name.split(" ").join("-").toLocaleLowerCase()
        this.slug = `${slug}`
    }
})

const eventModel = mongoose.model(EVENT_MODEL_NAME, eventSchema)

export default eventModel