# Backend setup guide
## 1. Clone the repository

`git clone https://github.com/Pojzo/amcef` <br>

## 2. Install dependencies
- **Node version** `v22.6.0` <br>
- **npm version** `10.8.2` <br> <br>
`cd amcef` <br>
`npm install` <br>

## 3. Initialize the Database

### MySQL Setup

- **Version:** `5.7.24`
- **OS:** `macOS 11.1`
- **Port:** `3306`
- **Root Password:** `Root12345`

1. **Set up a MySQL server** on your local machine.
2. **Initialize the Database** with the following command:

Run `npm run db-init-test` to initialize testing database <br> <br>
`npm run db-init-dev` and `npm run db-init-prod` can also be used

## 4. Start the server
Run `npm run test` to start the server<br> <br>
Default endpoint URL is `http://localhost:8888` <br>
Ensure that all tests pass by running `npx cypress run` <br>




# Frontend setup guide
## 1. Clone the repository
`git clone https://github.com/Pojzo/amcef-frontend`

## 2. Install dependencies
- **Node version** `v22.6.0` <br>
- **npm version** `10.8.2` <br> <br>
`cd amcef frontend` <br>
`npm install`

## 3. Run the app
`npm run start`