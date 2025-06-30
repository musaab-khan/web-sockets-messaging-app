import User from "../models/User";
import {Request, Response} from 'express';
import ValidationHelper from "../helpers/validations/ValidationHelper";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class UserController{
    async create( req: Request, res: Response ){
        try{
            const validationRules = {
                user_name: 'string|required|min:3|max:30',
                email: 'string|required|email',
                password: 'string|required|min:8|max:30',
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const { user_name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = await User.create( {
                user_name,
                email,
                password:hashedPassword
            });

            res.status(201).send({msg:"New user created", Users: newUser});
        }
        catch(err){
            res.status(400).send({error:err});
        }
    }

    async login(req: Request, res: Response){
        try{
            const validationRules = {
                email: 'string|required|email',
                password: 'string|required|min:8|max:30',
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const { email,password } = req.body;
            const user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({ msg: "Incorrect email or password" });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ msg: "Incorrect email or password" });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SIGN_SECRET!, { expiresIn: "12h" });

            const userObj = user.toJSON() as Record<string, any>;
            delete userObj.password;
            
            return res.status(200).json({ user: userObj, token: token });
        }
        catch(err){
            return res.status(400).json({error:err});
        }
    }
}

export default new UserController();