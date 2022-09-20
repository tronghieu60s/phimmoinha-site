# Phim Mới Nha

## Host

IP: 194.233.78.169
Domain: phimmoinha.com

## Git

```bash
$ git submodule update --init
$ git submodule foreach git pull origin master
```

## Mongo Data

```bash
$ mongodump --db=mongo --out="c:/opt/backup"
$ mongorestore --db=mongo --host=194.233.78.169 --drop "c:/opt/backup/mongo"
```

## Docker Compose

```bash
$ docker-compose up -d nginx
$ docker-compose up -d redis mongo server
$ docker-compose up -d web cms
$ docker-compose down
$ docker-compose up -d --no-deps --build <service_name>
```
