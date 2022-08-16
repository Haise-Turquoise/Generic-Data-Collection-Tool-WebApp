import { Response } from "express";
import { Error } from "mongoose";
import Counter from "../../models/Counter";

export const idGenerator = (collection: any) => {
    //checking by collection, creates and returns an id string 
    if (collection === "Program"){
        //need to search the database to find the corresponding 
        Counter.findOne({coll: "Program"}).then(check => {
            //if it already exists
            if (!check){
                Counter.create({
                    coll: "Program",
                    name: "Prog",
                    incr: 0
                }).then( d => {
                    return "Prog-0"
                })
            } else {
                Counter.findOneAndUpdate(check, {incr: check.incr + 1})
                return check.incr + 1;
            }
        })
    }
    return Math.random();
};


