# Hubla Challange: Next.js and Nest.js Application with Docker Compose

This is a web application built with Next.js for the frontend and Nest.js for the backend. Docker Compose is used to orchestrate the services and Swagger is used to document the backend API.

## Prerequisites

Before running the application, you need to have the following software installed on your machine:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)


## Getting Started

To get started with the application, follow these steps:

1. Clone the repository: `git clone https://github.com/felipealvarenga/hubla.git`
2. Navigate to the project directory: `cd hubla`
3. Start the application: `docker-compose up --build`

The frontend will be accessible at [http://localhost:3000](http://localhost:3000) and the backend API will be accessible at [http://localhost:3333](http://localhost:3333).

## Documentation

The backend API is documented using Swagger. To access the documentation, navigate to [http://localhost:3333/docs](http://localhost:3333/docs).

## Features

The application allows users to upload file transactions of sales and commissions from creators or affiliates. It also lists all transactions, creator balances, and affiliate balances.

## Credits

This application was built by [Felipe Alvarenga] as part of [Hubla Challange].
