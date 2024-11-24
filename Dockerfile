# Stage 1: Build React frontend
FROM node:14 as react-build
WORKDIR /app
COPY ./client/package.json ./
RUN npm install 
COPY ./client ./
RUN npm run build

# Stage 2: Setup Node.js server
FROM node:14-alpine
WORKDIR /app
COPY ./package.json /app
RUN npm install
COPY . .
COPY --from=react-build /app/build ./client/build


EXPOSE 3000

CMD ["npm", "start"]
