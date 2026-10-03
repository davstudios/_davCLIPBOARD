# Changelog

## 26.10.1
- Adottato il versioning `_davstudios` `YY.M.REVISIONE` per la release corrente.
- Sincronizzate tutte le versioni tecniche in npm, package-lock, Tauri, Cargo e Cargo.lock.
- Eseguita la repository normalization completa dell'intero pacchetto senza modifiche funzionali al motore clipboard.
- Rafforzati i controlli release GitHub e la compatibilità del parser Cargo.lock con checkout LF e CRLF su Windows.
- Rimossa la versione hardcoded dall'interfaccia: il numero di release viene letto direttamente da Tauri.

## 26.9.2

Automazione della descrizione delle GitHub Release secondo il nuovo standard bilingue `_davstudios`.

- Versione sincronizzata a `26.9.2` in npm, Tauri, Cargo, lockfile, launcher e interfaccia.
- Il workflow GitHub Actions usa ora automaticamente il corpo del commit associato al tag come descrizione della Release.
- La Description inserita in GitHub Desktop viene quindi riutilizzata senza duplicazioni nella pagina GitHub Release.
- Aggiunta una verifica che richiede entrambe le sezioni `🇮🇹` e `🇺🇸` prima di pubblicare la Release.
- Rimossa la vecchia descrizione statica generica della Release.
- Nessuna modifica alla logica della clipboard, all'interfaccia o alle funzionalità dell'app.

## 26.9.1

Standardizzazione della release `_davstudios` e adozione del nuovo schema di versioning `YY.M.REVISIONE`.

- Versione sincronizzata a `26.9.1` in npm, Tauri, Cargo, lockfile, launcher e interfaccia.
- Aggiunti publisher `_davstudios`, homepage ufficiale, copyright, licenza MIT e file di licenza nei metadata del bundle.
- Aggiunti i metadata Debian per la distribuzione Linux.
- Mantenuto invariato l'identifier storico `studio.dav.clipboard` per preservare l'identità dell'app.
- Aggiornato il README con istruzioni per installare release non firmate su Windows, macOS e Linux.
- Rafforzato il workflow Linux contro repository Microsoft non raggiungibili sui runner Ubuntu.
- Aggiornata la documentazione di build, supporto multipiattaforma e release.
- Nessuna modifica al comportamento della cronologia appunti o alle funzioni dell'app.

## 1.1.0

Aggiornamento di compatibilità multipiattaforma per la release stabile.

- Rigenerate tutte le icone PNG Tauri come immagini truecolor RGBA a 32 bit.
- Corretto l'errore di compilazione `icon .../32x32.png is not RGBA` su macOS e Linux.
- Rigenerato `icon.icns` dalla stessa sorgente RGBA mantenendo invariato `icon.ico`.
- Aggiunto un test di contratto che verifica che tutte le PNG di bundle siano effettivamente RGBA.
- Versione tecnica sincronizzata a 1.1.0.

## 1.0.0

Prima release stabile di `_davCLIPBOARD`.

- Aggiunta scorciatoia globale `Ctrl/Cmd + Shift + V` per richiamare l'app e focalizzare la ricerca.
- Aggiunta opzione di avvio automatico con Windows, macOS e Linux tramite plugin Tauri ufficiale.
- Aggiunta navigazione da tastiera nella cronologia con frecce, Invio, Esc e `Ctrl/Cmd + F`.
- Aggiunta pulizia automatica configurabile dopo 1, 7, 30 o 90 giorni con conservazione dei preferiti.
- Mantenuta la deduplicazione intelligente degli appunti già presenti.
- Aggiornata la pagina Impostazioni per la release stabile.
- Aggiunta workflow GitHub Actions per build e Release automatica da tag `v*`.
- Versione tecnica sincronizzata a 1.0.0.

## 0.2.1

- Sostituita l’icona principale di `_davCLIPBOARD` con l’asset definitivo fornito per la preview.
- Rigenerate tutte le icone Tauri in `src-tauri/icons/` dalla nuova icona: 32x32, 128x128, 256x256, app-icon e ICNS.
- `src-tauri/icons/icon.ico` conserva esattamente i byte del file `.ico` fornito.
- Versione tecnica sincronizzata a 0.2.1.

## 0.2.0

- Allineato il comportamento delle animazioni al motion system condiviso con `_davSPACE`.
- Aggiunta la sequenza di ingresso `startup` per brand, navigazione, topbar e contenuti.
- Aggiunte transizioni di pagina coerenti tra Cronologia, Preferiti e Impostazioni.
- Aggiunti aggiornamenti `content` per cattura, preferiti, eliminazione e monitoraggio senza usare animazioni da cambio pagina.
- Tema e lingua ora usano le stesse transizioni View Transition/fallback di `_davSPACE`.
- Aggiunto ingresso progressivo per statistiche, toolbar, pannelli e righe degli appunti.
- Aggiunti micro-feedback coerenti su card, icone azione, stato monitoraggio, stato vuoto e banner privacy.
- Aggiunto supporto completo a `prefers-reduced-motion` per le nuove animazioni.
- Gerarchia della topbar riallineata alla suite con sottotitolo descrittivo.
- Base CSS condivisa con `_davSPACE` mantenuta invariata; gli stili specifici della clipboard restano aggiuntivi.

## 0.1.2

- Allineate sidebar, icona Impostazioni, Buy Me A Coffee, sito e controlli tema al design system di `_davSPACE`.
- Sostituita l’icona Preferiti con una stella vettoriale coerente con la suite.
- Corretto il testo del pulsante in “Comprami Un Caffè”.
- Base CSS e motion riallineata alla versione di riferimento `_davSPACE v1.0.2`.

## 0.1.1

- Corretto l’avvio locale quando `node_modules` è presente ma incompleto.
- I launcher sincronizzano sempre le dipendenze npm prima di avviare o compilare l’app.
- Versione tecnica sincronizzata a 0.1.1.

## 0.1.0

Prima preview pubblica di `_davCLIPBOARD`.

- Cronologia automatica degli appunti di testo.
- Persistenza locale tramite file JSON nei dati dell'app.
- Ricerca, preferiti, ricopia ed eliminazione.
- Pulizia della cronologia con conservazione dei preferiti.
- Limite cronologia configurabile.
- Tema chiaro/scuro/sistema e Italiano/English.
- UI allineata al design system `_davstudios`.
- Base Tauri 2 + Rust + Vite 8.
