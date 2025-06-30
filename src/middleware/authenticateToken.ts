import jwt from 'jsonwebtoken';
import {Request, Response,Next} from 'express';

export default function authenticateToken(req: Request, res: Response, next: Next){
    try{
        const token = req.header("Authorization");
        if(!token){
            return res.status(401).send({msg:"No authorization token found"});
        }
        
        const decode:any = jwt.verify(token, 'secretkey');
        if(decode){
            req.userId= decode.userId;
            next();
        }else{
            return res.status(401).send({msg:"could not verify token"});
        }
    }
    catch(error){
        res.status(401).send({msg:"Invalid Authoization Token"});
    }
};