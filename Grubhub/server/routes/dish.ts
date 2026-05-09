import express, { Request, Response } from 'express';
import * as dishHandler from "../handlers/dish.js";
const dishRouter = express.Router();


dishRouter.post("/dish/add", (req: Request, res: Response) => {
    const dish_details = req.body;
    console.log(dish_details)
    dishHandler.addDish(dish_details).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

dishRouter.get("/dish/:dish_id", (req: Request, res: Response) => {
    const dish_id = parseInt(req.params.dish_id as string);
    dishHandler.getDishDetails(dish_id).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

dishRouter.post("/dish/update", (req: Request, res: Response) => {
    const dish_details = req.body;
    dishHandler.updateDish(dish_details).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

dishRouter.delete("/dish/delete/:dish_id", (req: Request, res: Response) => {
    const dish_id = parseInt(req.params.dish_id as string);
    dishHandler.deleteDish(dish_id).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        console.log("Dish delete Error:", err)
        res.status(500).json({
            message: err.message
        })
    })
})

dishRouter.get("/buyer/search", (req: Request, res: Response) => {
    const search_key = req.query.key as string;
    dishHandler.searchDishes(search_key).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})


export default dishRouter;
