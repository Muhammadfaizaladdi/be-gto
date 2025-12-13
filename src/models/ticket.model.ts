import mongoose, { ObjectId } from 'mongoose'
import * as Yup from 'yup'

import { EVENT_MODEL_NAME } from './event.model'

export const TICKET_MODEL_NAME = "Ticket"
const Schema = mongoose.Schema

export const ticketDAO = Yup.object({
    price : Yup.number().required(),
    name : Yup.string().required(),
    events: Yup.string().required(),
    description: Yup.string().required(),
    quantity: Yup.number().required()
})

export type TypeTicket = Yup.InferType<typeof ticketDAO>

export interface Ticket extends Omit<TypeTicket, "events"> {
    events: ObjectId
}

const ticketSchema = new Schema<Ticket>({
    price: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    events: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: EVENT_MODEL_NAME
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    quantity: {
        type: Schema.Types.Number,
        required: true
    }
    
},{
    timestamps: true
})

const ticketModel = mongoose.model(TICKET_MODEL_NAME, ticketSchema)

export default ticketModel