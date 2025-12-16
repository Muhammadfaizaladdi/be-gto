import { Response } from "express"

import { IPaginationQuery, IReqUser } from "../utils/interface"
import response from "../utils/response"
import eventModel, { eventDAO, TEvent } from "../models/event.model"
import { FilterQuery, isValidObjectId } from "mongoose"

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const payload = { ...req.body, createdBy: req.user?.id} as TEvent
            await eventDAO.validate(payload)
            const result = await eventModel.create(payload)
            response.success(res, result, "success create an event")
        } catch (error) {
            response.error(res, error, "failed to create an event")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const {limit=10, page=1, search} = req.query as unknown as IPaginationQuery

            const query: FilterQuery<TEvent> = {}

            if (search){
                Object.assign({
                    ...query,
                    $text: {
                        $search: search
                    }
                })
            }

            const result = await eventModel.find(query)
                .limit(limit)
                .skip((page-1)*limit)
                .sort({createdAt: -1})
                .exec()
            const count = await eventModel.countDocuments(query)


            response.pagination(res, result,{
                current: page,
                total: count,
                totalPages: Math.ceil(count/limit)
                }, "success find all events")

        } catch (error) {
            response.error(res, error, "failed find all events")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)){
                return response.notfound(res, "failed find one an event")
            }
            
            const result = await eventModel.findById(id)
            
            if (!result){
                return response.notfound(res, "failed find one an event")
            }
            
            response.success(res, result, "Success find one event")
        } catch (error) {
            response.error(res, error, "failed find one event")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)){
                return response.notfound(res, "failed update one an event")
            }
            
            const result = await eventModel.findByIdAndUpdate(id, req.body, {new: true})
            if (!result){
                return response.notfound(res, "failed update one an event")
            }
            response.success(res, result, "Success update an event")
        } catch (error) {
            response.error(res, error, "failed to update an event")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)){
                return response.notfound(res, "failed remove one an event")
            }
            
            const result = await eventModel.findByIdAndDelete(id, {new: true})
            if (!result){
                return response.notfound(res, "failed remove one an event")
            }
            response.success(res, result, "Success detele an event")
        } catch (error) {
            response.error(res, error, "failed to delete an event")
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params
            const result = await eventModel.findOne({slug,})
            response.success(res, result, "Success find one by slug an event")
        } catch (error) {
            response.error(res, error, "failed find one an event by slug")
        }
    },
}