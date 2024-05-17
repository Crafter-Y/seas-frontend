#!/bin/bash

npx tailwindcss --input input.css --output tailwind.css --no-autoprefixer --watch &

npx tailwind-rn --watch &

exec "$@"