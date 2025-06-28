import newProductSchema from "../schemas/newProduct";
import { z } from "zod";

export type NewProductForm = z.infer<typeof newProductSchema>;
