import { Response } from "express"
import { IPaginationQuery, IReqUser } from "../utils/interface"
import response from "../utils/response"
import ticketModel, { ticketDAO, TypeTicket } from "../models/ticket.model"
import { FilterQuery, isValidObjectId } from "mongoose"

export default {
    async create(req: IReqUser, res:Response) {
        try {
            await ticketDAO.validate(req.body)
            const result = await ticketModel.create(req.body)
            response.success(res, result, "success to create a ticket")
        } catch (error) {
            response.error(res, error, "failed to create a ticket")
        }
    },
    async findAll(req: IReqUser, res:Response) {
        try {
            const {limit=10, page=1, search} = req.query as unknown as IPaginationQuery

            const query: FilterQuery<TypeTicket> = {}
                if (search){
                    Object.assign({
                        ...query,
                        $text: {
                            $search: search
                        }
                    })
                }
            

            const result = await ticketModel.find(query)
                .limit(limit)
                .skip((page-1)*limit)
                .sort({vreatedAt: -1})
                .exec()

            const count = await ticketModel.countDocuments(query)

            response.pagination(res, result, {
                current: page,
                total: count,
                totalPages: Math.ceil(count/limit)
            }, "success find all tickets")
        } catch (error) {
            response.error(res, error, "failed find all tickets")
        }
    },
    async findOne(req: IReqUser, res:Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)){
                return response.notfound(res, "failed find one a ticket")
            }
            
            const result = await ticketModel.findById(id)
            
            if (!result){
                return response.notfound(res, "failed find one a ticket")
            }
            
            response.success(res, result, "success find one ticket")
        } catch (error) {
            response.error(res, error, "failed to find a ticket")
        }
    },
    async update(req: IReqUser, res:Response) {
        try {
            const { id } = req.params
            if (!isValidObjectId(id)){
                return response.notfound(res, "failed update one a ticket")
            }
            const result = await ticketModel.findByIdAndUpdate(id, req.body, {new: true})
            if (!result){
                return response.notfound(res, "failed update one a ticket")
            }
            response.success(res, result, "success update a ticket")
        } catch (error) {
            response.error(res, error, "failed to update a ticket")
        }
    },
    async remove(req: IReqUser, res:Response) {
        try {
            const { id } = req.params
            if (!isValidObjectId(id)){
                return response.notfound(res, "failed remove one a ticket")
            }
            const result = await ticketModel.findByIdAndDelete(id, {new: true})
            if (!result){
                return response.notfound(res, "failed remove one a ticket")
            }
            response.success(res, result, "success remove a ticket")
        } catch (error) {
            response.error(res, error, "failed to remove a ticket")
        }
    },
    async findAllByEvent(req: IReqUser, res:Response) {
        try {
            const { eventId } = req.params

            if(!isValidObjectId(eventId)){
                return response.error(res, null, "tickets not found")
            }



            const result = await ticketModel.find({events:eventId,})
            response.success(res, result, "success find all tickets by an event")
        } catch (error) {
            response.error(res, error, "failed to find tickets by event")
        }
    },
}