FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_WEB3FORMS_ACCESS_KEY
ENV VITE_WEB3FORMS_ACCESS_KEY=$VITE_WEB3FORMS_ACCESS_KEY

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
