# GitHub setup — _davCLIPBOARD

La repository è pubblica e le release vengono generate dal workflow `.github/workflows/release.yml` quando viene pubblicato un tag `v*`.

## Versioning `_davstudios`

Formato: `vYY.M.REVISIONE`.

Per questa release:

```text
v26.9.1
```

La versione tecnica interna non contiene la `v` ed è quindi `26.9.1`. Package JSON, Cargo e Tauri devono riportare sempre lo stesso valore.

## Pubblicazione

Dopo il commit e il Push Origin da GitHub Desktop:

```bash
git tag -a v26.9.1 -m "Release _davCLIPBOARD v26.9.1"
git push origin v26.9.1
```

Il workflow verifica che il tag e le versioni interne coincidano prima di creare gli asset Windows, macOS e Linux.
