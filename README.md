# SEAS - Kirchengemeinden - Selbsteinteilungs- & Administrationssoftware

This is the official source code of frontend/website/android/iOS app of SEAS - Kirchengemeinden. There unfortunately is no the source code of the backend/API available, because it's a commercial product. But feel free to request a demo and don't be afraid to contribute to this project or clone it and make it better for yourself or your community.

## Development

In the mobile app, you can freely choose community you want to use.

Since the webapp is only for one community, you'll need to adjust the `public/config.json` and use an existing product id.

Feel free to request a demo community.

```bash
npm install
```

```bash
npm run dev
```

## Hosting

The Docker image serves the static web export with nginx (`nginx.conf`). The tenant is the first
label of the host name (`42389.seas-kirchengemeinde.de` → `/config.json` returns `{"serverId":"42389"}`).

```bash
docker build -t seas-frontend . && docker run --rm -p 8080:80 seas-frontend
curl -H 'Host: 12345.localhost' localhost:8080/config.json
```

`dev` deploys to staging (`<id>.preview.seas-kirchengemeinde.de`), `master` to production
(`.github/workflows/frontend.yml`).

## Exporting

```bash
npx expo export
```

For the web export, you'll need to edit the config.json file manually in the directory of the output.
