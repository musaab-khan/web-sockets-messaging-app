import {Request, Response, Next} from 'express';

export default function printRequest( req: Request, res: Response, next: Next ){

    console.log(req.body);
    next();
    
}