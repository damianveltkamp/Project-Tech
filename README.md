# Project-Tech
Repository for the Project Tech course

## Table of contents
* [Installing](#installing)
* [License](#license)

## Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Redis](https://redis.io/download)

## Installing
Important to execute these top to bottom!

Clone this repository into your local project folder
```
git clone https://github.com/damian1997/Project-Tech.git
```

Install packages
```
npm install
```

Setup environment variables
* DB_USER
* DB_PASS
* DB_HOST
* EMAIL
* EMAIL_PASS
* CAPTCHA_SITE_KEY
* CAPTCHA_SECRET
* SESSION_SECRET
* SESSION_NAME
* REDIS_USER
* REDIS_PASS
* REDIS_HOST


Spin up a redis caching server
```
redis-server redis.conf
```

To run a dev server type this into your terminal when you are inside your project folder
```
npm run dev
```

## License
Find the license for the repository here
[License](https://github.com/damian1997/Project-Tech/blob/main/LICENSE)
