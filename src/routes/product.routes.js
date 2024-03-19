import { Router } from "express";
import { ProductManager, Product } from "../manager/ProductManager.js";

const router = Router();
const manager = new ProductManager("./src/data/productos.json");


function validateProd (req, res, next) {
    const {title, description, price, code, stock, category} = req.body;
    
    if (!title) {
        return res.json ({
            error: "El Nombre del producto es necesario"
        })
    }

    if (!description) {
        return res.json ({
            error: "La Descripcion del producto es necesaria"
        })
    }

    if (!price) {
        return res.json ({
            error: "El precio del producto es necesario"
        })
    }

    if (!code) {
        return res.json ({
            error: "El codigo del producto es necesario"
        })
    }
    if (!stock) {
        return res.json ({
            error: "El stock de productos es necesario"
        })
    }

    if (!category) {
        return res.json ({
            error: "La categoria de producto es necesaria"
        })
    }

    next();
}

router.get("/", async (req,res) => {

    const productos = manager.getProducts();

    const limit = await Number(req.query.limit);
    console.log(limit);

    if (limit) {
        const productosFiltrados = productos.slice(0,limit);
        res.send (productosFiltrados);
        return;
    } 
    res.json (productos);
})

router.get ("/:pid", async (req, res) => {
    console.log (req.params);
    const { pid } = req.params;

    const producto = await manager.getProductById(Number(pid));

    res.send (producto);
})

router.post ("/", validateProd, async (req, res) => {
    const {title, description, price, code, stock, category} = req.body;
    const producto = new Product (title, description, price, code, stock, category);

    try { const addProduct = await manager.addProduct(producto);
        if (addProduct?.error) { return res.status(409).json({error: addProduct.error})
            }

        res.json ({
            message: "Producto Creado",
            producto,
        });
    } catch (e) {
            res.status(500).json ({
            error: e.message,
        });
    }
});

router.put ("/:pid", validateProd, async (req,res) => {
    console.log (req.params);
    const { pid } = req.params;
    
    const {title, description, price, code, stock, category} = req.body;
    const producto = new Product (title, description, price, code, stock, category);

    try {
        const upDateProduct = await manager.updateProduct(Number(pid), producto);

        if (upDateProduct?.error) { return res.status(409).json({error: upDateProduct.error})
            }
            res.json ({
            message: "Producto Actualizado",
            producto,
        });
        } catch (e) {
            res.status(500).json ({
            error: e.message,
        });
    }
})

router.delete ("/:pid", async (req, res) => {
    console.log (req.params);
    const { pid } = req.params;
    
    try { const deleteProduct = await manager.deleteProduct(Number(pid));

        if (deleteProduct?.error) {
            return res.status(409).json({error: deleteProduct.error})
        }
        res.json ({
            message: "Producto eliminado",
        });
    } catch (e) {
        res.status(500).json ({
            error: e.message,
        });
    }
})




export default router;