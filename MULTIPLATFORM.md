# Supporto multipiattaforma

`_davCLIPBOARD v26.9.2` usa Tauri 2 e i plugin ufficiali clipboard manager, global shortcut e autostart.

## Windows

Usa `RUN-WINDOWS.bat` per lo sviluppo e `BUILD-WINDOWS.bat` per il bundle. Le release GitHub non sono attualmente firmate con un certificato Authenticode commerciale; SmartScreen può quindi mostrare un avviso.

## macOS

Usa `RUN-MACOS.sh` e `BUILD-MACOS.sh`. La scorciatoia usa `Command + Shift + V`. Le release GitHub non sono attualmente firmate con Developer ID né notarizzate da Apple; Gatekeeper può quindi richiedere l'apertura manuale da Privacy e Sicurezza.

## Linux

Su Ubuntu/Debian esegui prima `INSTALL-LINUX-DEPS-UBUNTU.sh`, poi `RUN-LINUX.sh` o `BUILD-LINUX.sh`. La workflow GitHub disabilita eventuali sorgenti Microsoft non raggiungibili prima di installare le dipendenze Tauri.

La cronologia viene salvata nella directory dati applicazione risolta da Tauri su ciascun sistema operativo. L'avvio automatico e la scorciatoia globale sono gestiti dai plugin Tauri ufficiali per desktop.

## Compatibilità icone

Le icone PNG del bundle sono salvate in formato truecolor RGBA, requisito verificato dai test per evitare errori di `generate_context!()` su macOS e Linux.
