#!/usr/bin/bash

cd /home/merv/Developer/abantu-app-staging

git pull

/home/merv/.bun/bin/bunx expo export --platform=web

/home/merv/.bun/bin/bunx eas-cli@latest deploy --prod


