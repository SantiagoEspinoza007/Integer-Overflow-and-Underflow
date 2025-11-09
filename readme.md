
Este repositorio contiene una demostración que muestra las vulnerabilidades **Integer Overflow** y **Integer Underflow** usando una **tienda tecnológica** (productos como MacBook, iMac, GPU).  
Incluye tres componentes:

- **Tienda vulnerable** (`vuln-tech-store.js`) — calcula totales con aritmética `uint32` simulada → **vulnerable a overflow**. También tiene endpoint de devolución vulnerable → **underflow**.
- **Tienda segura** (`safe-tech-store.js`) — usa `BigInt`, validaciones y límites → **mitiga overflow/underflow**.
- **CLI interactiva** (`exploit-tech-cli.js`) — interfaz en español para ver productos, ejecutar exploit automático (overflow) y simular devoluciones (underflow).

> Todo está preparado para ejecutarse con **Docker** (recomendado para la demo).

---

## Requisitos mínimos

- Docker y Docker Compose instalados.
- Código del proyecto en la misma carpeta (archivos `.js`, `package.json`, `Dockerfile`, `docker-compose.yml`).

---

## Comandos principales

1. **Construir la imagen** (primera vez o después de cambios):
```bash
docker compose build
