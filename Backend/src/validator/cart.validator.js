import {body, validationResult} from 'express-validator';

const validate = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export const addCartValidation =[
    body("productId").isMongoId().withMessage("invalid Product Id"),
    body("variantId").optional().isMongoId().withMessage("Invalid Variants Id"),
     body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
     validate
]