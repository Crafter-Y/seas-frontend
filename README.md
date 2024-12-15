# SEAS - Kirchengemeinden - Selbsteinteilungs- & Administrationssoftware

This is the official source code of frontend/website/android/iOS app of SEAS - Kirchengemeinden. There unfortunately is no the source code of the backend/API available, because it's a commercial product. But feel free to request a demo and don't be afraid to contribute to this project or clone it and make it better for yourself or your community.

## Development

In the mobile app, you can freely choose community you want to use.

Since the webapp is only for one community, you'll need to adjust the `assets/config.json` and use an existing product id.

Feel free to request a demo community.

```bash
npm install
```

```bash
npm run dev
```

## Hosting

Just export the project (npm run build:web), put it onto a webspace and route every request to root that is not a ressource (/).

The serve script (serve.js) can handle that for you. (No SSL)

## Docker

To just host the application (Using the node script from above without SSL):

```bash
docker run -d -p 80:80 -e PORT=80 -e SERVER_ID=12345 --name seas craftery/seas-frontend:latest
```

## Exporting

```bash
npx expo export
```

For the web export, you'll need to add the config.json file manually in the asset directory of the output.
