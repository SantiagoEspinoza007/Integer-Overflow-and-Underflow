
const express = require("express");
const inquirer = require("inquirer");
const chalk = require("chalk");

// Simula aritmética uint32 (wrap-around)
function uint32Mul(a, b) { return (Math.imul(a >>> 0, b >>> 0) >>> 0); }
function uint32Add(a, b) { return ((a >>> 0) + (b >>> 0)) >>> 0; }

async function start() {
  const answers = await inquirer.prompt([
    { name: "port", message: "Puerto para TIENDA VULNERABLE", default: "3200", validate: v => !isNaN(Number(v)) }
  ]);
  const PORT = Number(answers.port);
  const app = express();
  app.use(express.json());

  // Catálogo
  const productos = {
    "MACBOOK": { codigo: "MACBOOK", nombre: "MacBook Pro 16\"", precio: 300000, stock: 5 },
    "IMAC":    { codigo: "IMAC",    nombre: "iMac 27\"", precio: 250000, stock: 5 },
    "GPU":     { codigo: "GPU",     nombre: "GPU High-End", precio: 500000, stock: 5 },
  };

  // Mostrar productos
  app.get("/productos", (req, res) => res.json(Object.values(productos)));

  // Compra vulnerable (overflow)
  app.post("/comprar", (req, res) => {
    const { cliente, carrito, pago } = req.body;
    if (!cliente || !Array.isArray(carrito) || typeof pago !== "number")
      return res.status(400).json({ error: "cliente, carrito y pago son requeridos" });

    let total = 0 >>> 0;
    for (const linea of carrito) {
      const p = productos[linea.producto];
      if (!p) return res.status(400).json({ error: "Producto desconocido" });
      const costo = uint32Mul(linea.cantidad, p.precio);
      total = uint32Add(total, costo);
    }
    if (pago < total) return res.status(400).json({ error: "Pago insuficiente", total });

    return res.json({ estado: "pagado (vulnerable)", cliente, total, pago });
  });

  // Devolución vulnerable (underflow)
  app.post("/devolver", (req, res) => {
    const { producto, cantidad } = req.body;
    const p = productos[producto];
    if (!p) return res.status(400).json({ error: "Producto desconocido" });

    const nuevoStock = ((p.stock >>> 0) - (cantidad >>> 0)) >>> 0;
    const anterior = p.stock;
    p.stock = nuevoStock;

    res.json({
      mensaje: "Devolución procesada (vulnerable)",
      producto,
      stockAnterior: anterior,
      cantidadDevuelta: cantidad,
      nuevoStock
    });
  });

  app.listen(PORT, () => {
    console.log(chalk.red.bold("TIENDA VULNERABLE ▶"), `http://localhost:${PORT}`);
    console.table(Object.values(productos).map(p => ({ producto: p.codigo, nombre: p.nombre, precio: p.precio, stock: p.stock })));
  });
}

start().catch(console.error);
