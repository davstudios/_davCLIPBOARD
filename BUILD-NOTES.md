# Build notes — _davCLIPBOARD v26.10.1

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

La v26.10.1 mantiene i plugin Tauri ufficiali clipboard-manager, opener, global-shortcut e autostart e adotta la repository normalization completa della suite _davstudios. Il funzionamento applicativo resta invariato rispetto alla release precedente; versioni tecniche, lockfile, workflow e controlli multipiattaforma sono sincronizzati al nuovo schema YY.M.REVISIONE.

## Metadata bundle

- Publisher: `_davstudios`
- Homepage: `https://davstudios.it`
- License: `MIT`
- Copyright: `© 2026 _davstudios`
- Identifier preservato: `studio.dav.clipboard`
- Categoria: `Utility`

## Firma

Le release attuali non usano certificati commerciali di firma Windows né Developer ID/notarizzazione Apple. Il README contiene le istruzioni per gli utenti che incontrano SmartScreen o Gatekeeper.

## Icone bundle

Tutte le PNG in `src-tauri/icons/` devono essere truecolor RGBA. `icon.ico` resta invariato.
