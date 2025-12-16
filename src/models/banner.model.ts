import mongoose from "mongoose";

import * as Yup from 'yup'

const Schema = mongoose.Schema

export const BANNER_MODEL_NAME = "Banner"

export const bannerDAO = Yup.object({
    title: Yup.string().required(),
    image: Yup.string().required(),
    isShow: Yup.boolean().notRequired()
})

export type TBanner = Yup.InferType<typeof bannerDAO>

interface Banner extends TBanner {}

const BannerSchema = new Schema<Banner>({
    title: {
        type: Schema.Types.String,
        required: true
    },
    image: {
        type: Schema.Types.String,
        required: true
    },
    isShow: {
        type: Schema.Types.Boolean,
    },
},{
    timestamps: true
})

const bannerModel = mongoose.model(BANNER_MODEL_NAME, BannerSchema)

export default bannerModel


