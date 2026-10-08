# Clase 3.2 — Logging estructurado

Repositorio de práctica para la clase **Métricas de Software**.

## Requisitos

- Node.js 22 o posterior.
- npm.
- `jq`.
- Git.

Los comandos `npm` y `jq` utilizados en esta práctica funcionan en Linux, macOS y Windows.

### Instalación de `jq`

**Ubuntu / Debian**

```bash
sudo apt-get update
sudo apt-get install jq
```

**macOS con Homebrew**

```bash
brew install jq
```

**Windows**

Utilice PowerShell. Si `jq` no está instalado, descárguelo desde la página oficial de jq o instálelo con el mecanismo disponible en su equipo. Después de instalarlo, cierre y abra nuevamente PowerShell si el comando todavía no aparece en `PATH`.

Compruebe la instalación en cualquier sistema:

```text
jq --version
```

## Preparación

En Linux/macOS use Terminal. En Windows use PowerShell.

```text
npm install
npm run doctor
```

No continúe hasta obtener:

```text
Entorno listo para la actividad.
```

## Archivos

Durante la actividad se modifica únicamente:

```text
src/orders.js
```

No modifique los archivos de `scripts/`.

## Flujo de trabajo

Después de modificar `src/orders.js`:

```bash
npm run exercise
```

El comando genera:

```text
logs/app.jsonl
```

Revise los logs con `jq`. Para visualizar una muestra sin depender de comandos específicos del sistema operativo también puede ejecutar:

```text
npm run logs:sample
```

Cuando considere terminada la instrumentación:

```bash
npm run evidence
```

Se generará:

```text
evidencia.txt
```

La actividad está completa cuando el archivo termina con:

```text
RESULTADO: EVIDENCIA COMPLETA
```

Para mostrar el resultado final sin utilizar `tail`:

```text
npm run evidence:show
```

Suba **únicamente `evidencia.txt`** al espacio indicado por el docente.
