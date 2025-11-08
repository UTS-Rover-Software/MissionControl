## Basic Setup

### Dependencies

#### Based

*If you don't have **nix** or **direnv** setup checkout **cringe** section*

```sh
direnv allow
```

that's it!

#### Cringe

Install the following dependencies on your machine:

- python 3.13
- uv
*NOTE: Check the `flake.nix` in case we forget to update docs*

Install python dependencies:

```sh
uv sync
```

run server:

```sh
uv run dev
```

### using the api

By default on localhost:8000, you can change the port by changing the `PORT` environment variable
For Swagger Docs go to `http://localhost:8000/docs` endpoint on your browser

## Project Structure

```.
├── app/
├── flake.lock
├── flake.nix
├── pyproject.toml
├── routers/
├── schemas/
├── services/
├── tests/
└── uv.lock````

