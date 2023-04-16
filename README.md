# Project for IsaDevDays 2023
- This project is based on PageRank algorithm based on social network, GITHUB in this case, using the API GraphQL to get the information of the users and their repositories. 
- The backend is developed in NodeJS and the frontend in Svelte.
- The database used is MongoDB using docker.
- There is implemented as well a command line interface to run the PageRank problem through it with different arguments. When clone use: `github-pagerank -h` to see the help.

- **STEPS FOR USING**:
    1. Run the command `npm install` & then in /frontend run the command `npm install`.
    2. Now create a docker container for the database using the command `docker run -d -p 27017:27017 mongo`. You can as well use the file .env to set the MONGO_URL and use other PORT.
    3. Don´t forget to configure your `GITHUB_TOKEN` in the .env file.
    4. If you want to run in developer mode, then run the command `npm start` in the root directory and `npm run dev --` in the /frontend directory at the same time. If poppers error comes out, go to /frontend/node_modules/@popperjs/core/package.json and add `"type: "module" `. Then go to `http://localhost:5173`.
    5. If you want to run in production mode, then run the command `npm start` in the root directory, and go to `http://localhost:`+`process.env.PORT` or `12345`. Remember to run the command `npm run build` in the /frontend directory before.
    6. You cant test the API using Postman runing the command `npm test`, the PORT to use tests is `12345`. Remember to run the command `npm start` in the root directory before running the tests.
    





