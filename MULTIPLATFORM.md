# Supporto multipiattaforma

`_davCLIPBOARD v1.0.0` usa Tauri 2 e i plugin ufficiali clipboard manager, global shortcut e autostart.

## Windows

Usa `RUN-WINDOWS.bat` per lo sviluppo e `BUILD-WINDOWS.bat` per il bundle.

## macOS

Usa `RUN-MACOS.sh` e `BUILD-MACOS.sh`. La scorciatoia usa `Command + Shift + V`.

## Linux

Su Ubuntu/Debian esegui prima `INSTALL-LINUX-DEPS-UBUNTU.sh`, poi `RUN-LINUX.sh` o `BUILD-LINUX.sh`.

La cronologia viene salvata nella directory dati applicazione risolta da Tauri su ciascun sistema operativo. L'avvio automatico e la scorciatoia globale sono gestiti dai plugin Tauri ufficiali per desktop.
