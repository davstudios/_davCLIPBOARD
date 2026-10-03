# GitHub setup — _davCLIPBOARD

La repository è pubblica e le release vengono generate dal workflow `.github/workflows/release.yml` quando viene pubblicato un tag `v*`.

## Versioning `_davstudios`

Formato: `vYY.M.REVISIONE`.

Per questa release:

```text
v26.10.1
```

La versione tecnica interna non contiene la `v` ed è quindi `26.10.1`. Package JSON, Cargo e Tauri devono riportare sempre lo stesso valore.

## Commit da GitHub Desktop

Per ogni release usa questo standard.

**Summary**

```text
_davCLIPBOARD v26.10.1
```

**Description**

```text
🇮🇹 [descrizione completa delle modifiche]

🇺🇸 [complete description of the changes]
```

Il workflow legge automaticamente **il corpo/Description del commit puntato dal tag** e lo usa come descrizione della GitHub Release. Non è quindi necessario duplicare manualmente il testo nella pagina Release.

Per evitare release incomplete, il workflow interrompe la pubblicazione se la Description è vuota o se mancano le sezioni `🇮🇹` e `🇺🇸`.

## Pubblicazione

Dopo il commit e il **Push Origin** da GitHub Desktop:

```bash
git tag -a v26.10.1 -m "Release _davCLIPBOARD v26.10.1"
git push origin v26.10.1
```

Il workflow verifica che il tag e le versioni interne coincidano, recupera la Description bilingue del commit e crea gli asset Windows, macOS e Linux con una GitHub Release stabile.
