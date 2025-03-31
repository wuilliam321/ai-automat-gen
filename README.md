## Build
```sh
docker build -t claude-selenium-server .
```

## Run
```sh
docker run -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY -p 3001:3001 claude-selenium-server:latest
```
