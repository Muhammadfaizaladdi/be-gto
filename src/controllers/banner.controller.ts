import { Response } from "express";

import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import bannerModel, { bannerDAO, TBanner } from "../models/banner.model";
import { FilterQuery } from "mongoose";


export default{
    async create(req: IReqUser, res: Response) {
        try {
            await bannerDAO.validate(req.body)
            const result = await bannerModel.create(req.body)
            response.success(res, result, "success create a banner")

        } catch (error) {
            response.error(res, error, "failed to create a banner")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const {limit=10, page=1, search} = req.query as unknown as IPaginationQuery
            
            const query: FilterQuery<TBanner> = {}

            if(search) {
                Object.assign({
                    ...query,
                    $text: {
                        $search: search
                    }
                })
            }

            const result = await bannerModel.find(query)
                .limit(limit)
                .skip((page-1)*limit)
                .sort({createdAt: -1})
                .exec()
            const count = await bannerModel.countDocuments(query)

            response.pagination(res, result, {
                current: page,
                total: count,
                totalPages: Math.ceil(count/limit),
            }, "success to find all banners")
        } catch (error) {
            response.error(res, error, "failed to find all banners")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            const result = await bannerModel.findById(id)
            response.success(res, result, "Success to find a banner")
        } catch (error) {
            response.error(res, error, "failed to find a banner")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const {id} = req.params
            const result = await bannerModel.findByIdAndUpdate(id, req.body, {new: true})
            response.success(res, result, "success to update a banner")
        } catch (error) {
            response.error(res, error, "failed to update a banner")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const {id} = req.params
            const result =  await bannerModel.findByIdAndDelete(id, {new: true})
            response.success(res, result, "success to delete a banner")
        } catch (error) {
            response.error(res, error, "failed to remove a banner")
        }
    },
}