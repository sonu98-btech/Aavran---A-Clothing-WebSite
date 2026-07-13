import {body, validationResult} from 'express-validator';

const validate = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}
export const createProductValidator = [
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('color').notEmpty().withMessage("Color is required"),
    body('size').notEmpty().withMessage("Size is required"),
    body('stock').notEmpty().withMessage("Stock is required").isNumeric().withMessage("Stock must be a number"),
    body('priceAmount').notEmpty().withMessage("Price Amount is required"),
    body('priceCurrency').notEmpty().withMessage("Price Currency is required").isIn(["USD","EUR","GBP","INR","JPY"]).withMessage("Price Currency must be one of USD, EUR, GBP, INR, JPY"),
    validate
]