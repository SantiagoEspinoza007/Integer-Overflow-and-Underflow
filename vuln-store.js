
const express = require("express");
const chalk = require("chalk");

const PORT = 3200;

function uint32Mul(a, b) { return (Math.imul(a >>> 0, b >>> 0) >>> 0); }
function uint32Add(a, b) { return ((a >>> 0) + (b >>> 0)) >>> 0; }

const app = express();
app.use(express.json());

const productos = {
  "MACBOOK": { codigo: "MACBOOK", nombre: "MacBook Pro 16\"", precio: 300000, stock: 5 },
  "IMAC":    { codigo: "IMAC",    nombre: "iMac 27\"", precio: 250000, stock: 5 },
  "GPU":     { codigo: "GPU",     nombre: "GPU High-End", precio: 500000, stock: 5 },
};

app.get("/", (req, res) => res.json({ info: "Tienda vulnerable (puerto fijo 3200). Endpoints: /productos, /comprar, /devolver" }));
app.get("/productos", (req, res) => res.json(Object.values(productos)));

app.post("/comprar", (req, res) => {
  const { cliente, carrito, pago } = req.body;
  if (!cliente || !Array.isArray(carrito) || typeof pago !== "number")
    return res.status(400).json({ error: "cliente, carrito y pago son requeridos" });

  let total = 0 >>> 0;
  for (const linea of carrito) {
    const p = productos[String(linea.producto || "").toUpperCase()];
    if (!p) return res.status(400).json({ error: `Producto desconocido: ${linea.producto}` });
    const cantidad = Number(linea.cantidad || 0) >>> 0;
    const costo = uint32Mul(cantidad, p.precio);
    total = uint32Add(total, costo);
  }
  if (pago < total) return res.status(400).json({ error: "Pago insuficiente", total });

  return res.json({ estado: "pagado (vulnerable)", cliente, total, pago });
});

app.post("/devolver", (req, res) => {
  const { producto, cantidad } = req.body;
  const key = String(producto || "").toUpperCase();
  const p = productos[key];
  if (!p) return res.status(400).json({ error: "Producto desconocido" });

  const cantidadN = Number(cantidad || 0) >>> 0;
  const anterior = p.stock;
  const nuevoStock = ((p.stock >>> 0) - (cantidadN >>> 0)) >>> 0;
  p.stock = nuevoStock;

  res.json({
    mensaje: "Devolución procesada (vulnerable)",
    producto: p.codigo,
    stockAnterior: anterior,
    cantidadDevuelta: cantidadN,
    nuevoStock
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(chalk.red.bold("TIENDA VULNERABLE ▶"), `escuchando en ${chalk.yellow(`http://0.0.0.0:${PORT}`)}`);
  console.table(Object.values(productos).map(p => ({ producto: p.codigo, nombre: p.nombre, precio: p.precio, stock: p.stock })));
});
