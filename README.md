# umami-mongodb

Umami is a simple, fast, website analytics alternative to Google Analytics.

# Credits

- Orignal Version of [Umami](https://umami.is) developed by [Mike Cao](https://mikecao.com/).

## Getting started

A detailed getting started guide can be found at [https://umami.is/docs/](https://umami.is/docs/)

## Installing from source

### Requirements

- A server with Node.js 12 or newer
- A database (mongodb)

### Get the source code and install packages

```
git clone https://github.com/lakshmansha/umami-mongodb.git
cd umami-mongodb
npm install
```

### Create database tables

Umami supports [MongoDb](https://www.mongodb.com/).
Create a database for your Umami installation and create the tables on App Intialization.

The Account Seeders will create Admin Account with username **admin** and password **umami**.

### Configure umami

Create an `.env` file with the following

```
MONGO_URI=(connection url)
HASH_SALT=(any random string)
```

The connection url is in the following format:
```
mongodb://username:mypassword@localhost:27017/umami

```

The `HASH_SALT` is used to generate unique values for your installation.

### Build the application

```bash
npm run build
```

### Start the application

```bash
npm start
```

By default this will launch the application on `http://localhost:3000`. You will need to either 
[proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) requests from your web server
or change the [port](https://nextjs.org/docs/api-reference/cli#production) to serve the application directly.

## Installing with Docker

To build the umami container and start up a MongoDb database, run:

```bash
docker-compose up
```

Alternatively, to pull just the Umami Docker image for MongoDB support:
```bash
docker pull lakshmansha/umami-mongodb:latest
```

## Getting updates

To get the latest features, simply do a pull, install any new dependencies, and rebuild:

```bash
git pull
npm install
npm run build
```

## License

MIT
