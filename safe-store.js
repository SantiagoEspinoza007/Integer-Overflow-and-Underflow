const express = require("express");
const chalk = require("chalk");

const PORT = 3201;

const app = express();
app.use(express.json());

const productos = {
  "MACBOOK": { codigo: "MACBOOK", nombre: "MacBook Pro 16\"", precio: 300000n, stock: 5n },
  "IMAC":    { codigo: "IMAC",    nombre: "iMac 27\"", precio: 250000n, stock: 5n },
  "GPU":     { codigo: "GPU",     nombre: "GPU High-End", precio: 500000n, stock: 5n },
};

const MAX_CANTIDAD = 10_000_000n;
const UPPER_LIMIT = (1n << 128n) - 1n;

app.get("/", (req, res) => res.json({ info: "Tienda segura (puerto fijo 3201). Endpoints: /productos, /comprar, /devolver" }));
app.get("/productos", (req, res) => res.json(Object.values(productos).map(p => ({
  producto: p.codigo, nombre: p.nombre, precio: p.precio.toString(), stock: p.stock.toString()
}))));

app.post("/comprar", (req, res) => {
  const { cliente, carrito, pago } = req.body;
  if (!cliente || !Array.isArray(carrito) || typeof pago !== "number")
    return res.status(400).json({ error: "cliente, carrito y pago son requeridos" });

  let total = 0n;
  for (const linea of carrito) {
    const key = String(linea.producto || "").toUpperCase();
    const p = productos[key];
    if (!p) return res.status(400).json({ error: `Producto desconocido: ${linea.producto}` });
    const cantidad = BigInt(linea.cantidad || 0);
    if (cantidad < 0n || cantidad > MAX_CANTIDAD) return res.status(400).json({ error: `Cantidad inválida para ${p.codigo}` });

    const costoLinea = cantidad * p.precio;
    if (costoLinea > UPPER_LIMIT) return res.status(400).json({ error: "Costo de línea demasiado grande" });

    total += costoLinea;
    if (total > UPPER_LIMIT) return res.status(400).json({ error: "Costo total demasiado grande" });
  }

  const pagoBig = BigInt(pago);
  if (pagoBig < total) return res.status(400).json({ error: "Pago insuficiente (total seguro)", totalRequerido: total.toString() });

  return res.json({ estado: "pagado (seguro)", cliente, total: total.toString(), pago: pagoBig.toString() });
});

app.post("/devolver", (req, res) => {
  const { producto, cantidad } = req.body;
  const key = String(producto || "").toUpperCase();
  const p = productos[key];
  if (!p) return res.status(400).json({ error: "Producto desconocido" });

  const cantidadN = BigInt(cantidad || 0);
  if (cantidadN > p.stock) return res.status(400).json({ error: "No se puede devolver más de lo disponible", stockActual: p.stock.toString() });

  const anterior = p.stock;
  p.stock = p.stock - cantidadN;

  res.json({
    mensaje: "Devolución procesada (segura)",
    producto: p.codigo,
    stockAnterior: anterior.toString(),
    cantidadDevuelta: cantidadN.toString(),
    nuevoStock: p.stock.toString()
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(chalk.green.bold("TIENDA SEGURA ▶"), `escuchando en ${chalk.yellow(`http://0.0.0.0:${PORT}`)}`);
  console.table(Object.values(productos).map(p => ({ producto: p.codigo, nombre: p.nombre, precio: p.precio.toString(), stock: p.stock.toString() })));
});
