FROM node:12 AS ui-build
WORKDIR /app
COPY client/ ./
RUN npm install
RUN npm run build

FROM node:12 AS server-build
WORKDIR /app
COPY --from=ui-build /app/dist ./dist
COPY server/ ./
RUN npm install

EXPOSE 8234

CMD ["node", "index.js"]
