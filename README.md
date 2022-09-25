# Phim Mới Nha

## Host

IP: 194.233.78.169
Domain: phimmoinha.com

## Authentication

### Admin Site

Admin: admin/phimmoinha.!QAZxsw2
Member: member/phimmoinha.@WSXcde3
Kiet: tuankiet1705/phimmoinha.QWERTasdfg

### Fshare Account

User: camngot1708@gmail.com/phimmoinha.^&\*(yuio

### Google Account

User: phimmoisotrim2409@gmail.com/phimmoinha.$TGVbhy5
User: phimmoinaruto1001@gmail.com/phimmoinha.^YHNmji8

### Abyss Upload

User: phimmoisotrim2409@gmail.com/phimmoinha.%RTYUujnb
User: phimmoinaruto1001@gmail.com/phimmoinha.!@#$%qwert

### Facebook Upload

User: tronghieu2012s@gmail.com/phimmoinha.ASDFtyui
User: phimmoinaruto1001@gmail.com/phimmoinha.!@#$%qwert

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
$ docker-compose stop <service_name>
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
