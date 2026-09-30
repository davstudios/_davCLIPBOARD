# Build notes — _davCLIPBOARD v26.9.2

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

La v26.9.2 usa i plugin Tauri ufficiali clipboard-manager, opener, global-shortcut e autostart. Il funzionamento applicativo resta invariato rispetto alla release precedente. Questa revisione aggiorna il workflow GitHub affinché la Description bilingue del commit venga riutilizzata automaticamente come descrizione della GitHub Release.

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
