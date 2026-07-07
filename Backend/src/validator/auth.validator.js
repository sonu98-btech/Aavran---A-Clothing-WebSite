import {body, validationResult} from 'express-validator';

const validate = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}
export const registerValidator = [
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('contact').isMobilePhone().withMessage("Please enter a valid contact number"),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body('fullname').notEmpty().isLength({min:3, max:30}).withMessage("Full name must be between 3 and 30 characters long"),
    body('isSeller').isBoolean().withMessage("isSeller must be a boolean value"),
    validate
]
