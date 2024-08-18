# Bibliotafo

Para preparar los archivos para desplegar en GitHub Pages:

`ng build --output-path docs --base-href /nombre-del-repo/`

Al usar este repo, que al llamarse usuario.github.io se despliega en su propio nombre sin usar usuario.github.io/nombre-del-repo/, en su lugar uso:

`ng build --output-path docs --base-href /`

El build genera estos archivos:

```
/docs/documento.txt
/docs/browser/deployment files
```

Para el despliegue, los archivos deben estar directamente en docs, así que hacemos:

```bash
mv docs/browser/* docs/
rm -r docs/browser
```

Luego se pushean los cambios y tenemos en GitHub lo necesario para el despliegue.

En el repositorio, settings, Pages: Deploy from branch: main, folder: docs.
