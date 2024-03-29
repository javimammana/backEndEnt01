import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


 //Rutas
app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido",
    });
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);


//Servidor
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

