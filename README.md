# Phim Mới Nha

## Host

IP: 194.233.78.169
Domain: phimmoinha.com

## Git

```bash
$ git submodule update --init
$ git submodule update --recursive --remote
$ git pull --recurse-submodules
```

## Docker

```bash
$ docker system prune
$ docker system prune -a
```

## Docker Compose

```bash
$ docker-compose up -d nginx
$ docker-compose up -d redis mongo server
$ docker-compose up -d web cms
$ docker-compose down
$ docker-compose up -d --no-deps --build <service_name>
```

## Mongo Data

```bash
$ mongodump --db=mongo --out="c:/opt/backup"
$ mongorestore --db=mongo --username=root --password=<root_password> --authenticationDatabase=admin --host=194.233.78.169 --drop "c:/opt/backup/mongo"
```

## Mongo Authentication

```bash
$ mongosh
$ use admin
$ db.auth("root", <root_password>)
$ db.changeUserPassword("root", <root_password>)
$ db.createUser({ user: "root", pwd: <root_password>, roles: [ { role: "root", db: "admin" } ] })
$ exit;
```
