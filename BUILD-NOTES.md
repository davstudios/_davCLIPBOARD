# Build notes — _davCLIPBOARD v1.0.0

## Requisiti

- Node.js 20+
- npm
- Rust/Cargo compatibile con Tauri 2
- dipendenze native Tauri del sistema operativo

## Test

```bash
npm test
```

## Sviluppo desktop

```bash
npm install --no-audit --no-fund
npm run desktop
```

## Bundle

```bash
npm run bundle
```

La v1.0.0 usa i plugin Tauri ufficiali clipboard-manager, opener, global-shortcut e autostart. Le icone Tauri derivano tutte dall'icona definitiva di `_davCLIPBOARD`; `icon.ico` resta byte-per-byte identico al file sorgente fornito.
