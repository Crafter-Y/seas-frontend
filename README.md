# SEAS - Kirchengemeinden - Selbsteinteilungs- & Administrationssoftware (Ehml. CSA-Frontend)

This is the official source code of frontend/website/android/iOS app of SEAS - Kirchengemeinden. There unfortunately is no the source code of the backend/API available, because it's a commercial product. But feel free to request a demo and don't be afraid to contribute to this project or clone it and make it better for yourself or your community.

## Next tasks

Core Features:

- [ ] user account system via email

Bugs:

- [ ] prevent spamming buttons in settings
- [ ] expo router modal being out of focus on small devices

General:

- [ ] improve general performance of the app (useCallback's ...)
- [ ] Updates via Expo Update

## Development

Before starting, you'll probably need change the `localApi` to our official URL given `productionApi` in `app.json`. You'll also need to put the correct `serverId` in the `assets/config.json`. If you plan to develop on this, just request a demo community.

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

To achive SSL, you might create an `docker-compose.yml` file and use the `certbot/certbot` image to automatically secure your site with letsencrypt.

## Exporting

On Windows, you'll need to put `npx` before the command.

```bash
expo export
```

For the web export, you'll need to add the config.json file manually in the asset directory of the output.
