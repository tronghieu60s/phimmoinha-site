# Phim Mới Nha

## Mongo Data

```bash
$ mongodump --db=mongo --out="c:/opt/backup"
$ mongorestore --db=mongo --host=194.233.78.169 --drop "c:/opt/backup/mongo"
```

## Docker Compose

```bash
docker-compose up -d redis mongo server
docker-compose up -d web cms
docker-compose up -d nginx
docker-compose down
docker-compose up -d --no-deps --build <service_name>
```
