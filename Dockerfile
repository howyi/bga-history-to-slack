FROM node:18-alpine as node
FROM docker:dind

COPY --from=node /opt/yarn* /opt/yarn
COPY --from=node /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm
COPY --from=node /usr/local/bin/node /usr/local/bin/

RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm
RUN ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

ENV TZ Asia/Tokyo
RUN apk add --no-cache tzdata libstdc++ libgcc && \
    cp /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo ${TZ} > /etc/timezone && \
    apk del tzdata

WORKDIR /var/lib/bga