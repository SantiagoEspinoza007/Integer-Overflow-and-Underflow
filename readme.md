
Este repositorio contiene una demostración que muestra las vulnerabilidades **Integer Overflow** y **Integer Underflow** usando una **tienda tecnológica** (productos como MacBook, iMac, iphone).  
Incluye tres componentes:

- **Tienda vulnerable** (`vuln-store.js`) — calcula totales con aritmética `uint32` simulada → **vulnerable a overflow**. También tiene endpoint de devolución vulnerable → **underflow**.
- **Tienda segura** (`safe-store.js`) — usa `BigInt`, validaciones y límites → **mitiga overflow/underflow**.
- **CLI interactiva** (`exploit-cli.js`) — ejecutar exploit automático (overflow) y simular devoluciones (underflow).

---


- **Node.js** `v18` (Alpine) — Entorno de ejecución JavaScript
- **Express.js** `v5.1.0` — Framework web minimalista para APIs REST


### **Arquitectura del Proyecto**

```
├── vuln-store.js          # Servidor vulnerable (puerto 3200)
├── safe-store.js          # Servidor seguro (puerto 3201)
└──  exploit-store-cli.js   # CLI interactiva para exploits
```

### **Características de Seguridad Comparadas**

| Característica | Vulnerable (`vuln-store`) | Seguro (`safe-store`) |
|---|---|---|
| **Aritmética** | `uint32` simulado (Math.imul) | `BigInt` nativo |
| **Detección Overflow** | No | Sí (validaciones) |
| **Detección Underflow** | No | Sí (límites de inventario) |
| **Límites de cantidad** | No | Máximo 1,000,000,000 tokens |

### **Puertos de Red**

- `3200` — API vulnerable (vuln-store)
- `3201` — API segura (safe-store)

---

**Comandos**:
```bash
docker compose build

docker compose up -d vuln-store safe-store

docker compose run --rm --service-ports cli
