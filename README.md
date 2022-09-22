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
$ docker system prune -a
$ docker volume prune -a
$ docker network prune -a
$ docker image prune -a
$ docker container prune -a
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
$ mongorestore --db=mongo --host=194.233.78.169 --drop "c:/opt/backup/mongo"
```

## Mongo Authentication

```bash
$ docker exec -it mongo bash
$ mongosh
$ use admin
$ db.createUser({user: "root", pwd: "camngot0102st", roles: [ { role: "root", db: "admin" } ]})
$ mongosh -u admin
$ exit;
```
