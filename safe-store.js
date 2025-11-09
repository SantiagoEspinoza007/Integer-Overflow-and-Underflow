
const express = require("express");
const inquirer = require("inquirer");
const chalk = require("chalk");

async function start() {
  const answers = await inquirer.prompt([
    { name: "port", message: "Puerto para TIENDA SEGURA", default: "3201", validate: v => !isNaN(Number(v)) }
  ]);
  const PORT = Number(answers.port);
  const app = express();
  app.use(express.json());

  const productos = {
    "MACBOOK": { codigo: "MACBOOK", nombre: "MacBook Pro 16\"", precio: 300000n, stock: 5n },
    "IMAC":    { codigo: "IMAC",    nombre: "iMac 27\"", precio: 250000n, stock: 5n },
    "GPU":     { codigo: "GPU",     nombre: "GPU High-End", precio: 500000n, stock: 5n },
  };

  app.get("/productos", (req, res) => res.json(Object.values(productos).map(p => ({
    producto: p.codigo, nombre: p.nombre, precio: p.precio.toString(), stock: p.stock.toString()
  }))));

  // Compra segura (BigInt)
  app.post("/comprar", (req, res) => {
    const { cliente, carrito, pago } = req.body;
    if (!cliente || !Array.isArray(carrito) || typeof pago !== "number")
      return res.status(400).json({ error: "cliente, carrito y pago son requeridos" });

    let total = 0n;
    for (const linea of carrito) {
      const p = productos[linea.producto];
      if (!p) return res.status(400).json({ error: "Producto desconocido" });
      const cantidad = BigInt(linea.cantidad);
      total += cantidad * p.precio;
    }
    if (BigInt(pago) < total) return res.status(400).json({ error: "Pago insuficiente", total: total.toString() });

    return res.json({ estado: "pagado (seguro)", cliente, total: total.toString(), pago });
  });

  // Devolución segura (previene underflow)
  app.post("/devolver", (req, res) => {
    const { producto, cantidad } = req.body;
    const p = productos[producto];
    if (!p) return res.status(400).json({ error: "Producto desconocido" });
    const cantidadN = BigInt(cantidad);
    if (cantidadN > p.stock) return res.status(400).json({ error: "No se puede devolver más de lo disponible", stockActual: p.stock.toString() });

    const anterior = p.stock;
    p.stock = p.stock - cantidadN;

    res.json({
      mensaje: "Devolución procesada (segura)",
      producto,
      stockAnterior: anterior.toString(),
      cantidadDevuelta: cantidadN.toString(),
      nuevoStock: p.stock.toString()
    });
  });

  app.listen(PORT, () => {
    console.log(chalk.green.bold("TIENDA SEGURA ▶"), `http://localhost:${PORT}`);
    console.table(Object.values(productos).map(p => ({ producto: p.codigo, nombre: p.nombre, precio: p.precio.toString(), stock: p.stock.toString() })));
  });
}

start().catch(console.error);
