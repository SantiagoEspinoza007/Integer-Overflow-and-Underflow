
Este repositorio contiene una demostración que muestra las vulnerabilidades **Integer Overflow** y **Integer Underflow** usando una **tienda tecnológica** (productos como MacBook, iMac, GPU).  
Incluye tres componentes:

- **Tienda vulnerable** (`vuln-store.js`) — calcula totales con aritmética `uint32` simulada → **vulnerable a overflow**. También tiene endpoint de devolución vulnerable → **underflow**.
- **Tienda segura** (`safe-store.js`) — usa `BigInt`, validaciones y límites → **mitiga overflow/underflow**.
- **CLI interactiva** (`exploit-cli.js`) — ejecutar exploit automático (overflow) y simular devoluciones (underflow).

---

**Comandos**:
```bash
docker compose build

```bash
docker compose up -d vuln-store safe-store

```bash
docker compose run --rm --service-ports cli
