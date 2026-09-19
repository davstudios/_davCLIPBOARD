<div align="center">
  <img src="src-tauri/icons/app-icon.png" width="112" alt="_davCLIPBOARD icon">
</div>

# `_davCLIPBOARD`

Gestore locale della cronologia appunti per Windows, macOS e Linux.  
Local clipboard history manager for Windows, macOS and Linux.

**v1.0.0 · Stable · Local-first · No telemetry**

Interfaccia e motion system condivisi con `_davSPACE` e la suite `_davstudios`.

## Italiano

`_davCLIPBOARD` monitora il testo copiato, conserva una cronologia locale ricercabile e permette di richiamarla rapidamente da tastiera.

### Funzioni v1.0.0

- Monitoraggio automatico degli appunti di testo.
- Cronologia persistente salvata localmente nei dati dell'app.
- Ricerca istantanea, preferiti, ricopia ed eliminazione.
- Gestione intelligente dei duplicati: un testo già presente viene riportato in cima senza duplicarlo.
- Limite configurabile: 50, 100, 250 o 500 elementi.
- Pulizia automatica opzionale dopo 1, 7, 30 o 90 giorni; i preferiti vengono conservati.
- Scorciatoia globale `Ctrl/Cmd + Shift + V` per aprire l'app e focalizzare la ricerca.
- Navigazione da tastiera: frecce per selezionare, Invio per copiare, `Ctrl/Cmd + F` per cercare.
- Avvio automatico opzionale con il sistema operativo.
- Tema Sistema, Chiaro e Scuro.
- Italiano e English.
- Nessuna telemetria e nessun invio online degli appunti.
- Design, testi, colori, icone e animazioni coerenti con il design system `_davstudios`.

Supporto immagini/file e system tray sono intenzionalmente lasciati a una revisione successiva per mantenere stabile la prima release.

### Avvio su Windows

`RUN-WINDOWS.bat`

Oppure:

```bash
npm install --no-audit --no-fund
npm run desktop
```

## English

`_davCLIPBOARD` monitors copied text, keeps a searchable local history and can be recalled quickly from the keyboard.

### v1.0.0 features

- Automatic text clipboard monitoring.
- Persistent local history stored in app data.
- Instant search, favorites, copy-back and deletion.
- Duplicate handling that moves existing clips to the top instead of duplicating them.
- Configurable 50, 100, 250 or 500 item limit.
- Optional cleanup after 1, 7, 30 or 90 days while preserving favorites.
- Global `Ctrl/Cmd + Shift + V` shortcut to open the app and focus search.
- Keyboard navigation with arrows, Enter and `Ctrl/Cmd + F`.
- Optional launch at system startup.
- System, Light and Dark themes.
- Italiano and English.
- No telemetry and no clipboard uploads.
- UI and motion aligned with the shared `_davstudios` design system.

## Support _davstudios

Website: https://www.davstudios.it  
Buy Me A Coffee: https://buymeacoffee.com/davstudios

## License

MIT
