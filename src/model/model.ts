import MongoClient from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let name = process.env.DB_NAME;
let password = process.env.DB_PASSWORD;

class model {

    protected dbName = 'livetex';

    protected url() {
        if (name !== '' && password !== '') return `mongodb://${name}:${password}@127.0.0.1:27017`;
        return 'mongodb://127.0.0.1:27017'
    }

    protected connect() {
        return new Promise<{ db: MongoClient.Db, client: MongoClient.MongoClient }>((resolve, reject) => {
            MongoClient.connect(this.url(), { useUnifiedTopology: true }, (err: MongoClient.MongoError, client: MongoClient.MongoClient) => {
                if (err) reject(err);

                const db = client.db(this.dbName);
                resolve({ db, client });
            });
        });

    }

    protected collection(db: MongoClient.Db, name: string) {
        const collection = db.collection(name);
        return collection;
    }

    protected async findOne<T>(name: string, need: {}) {
        let { db, client } = await this.connect();
        let collection = this.collection(db, name);

        return new Promise<T>((resolve, reject) => {
            collection.findOne(need, (err, doc) => {
                if (err) reject(err);

                client.close();
                resolve(doc);
            })
        });
    }

    protected async updateOne(name: string, query: {}, updatedData: {}) {
        let { db, client } = await this.connect();
        let collection = this.collection(db, name);

        return new Promise((resolve, reject) => {
            collection.updateOne(query, updatedData, (err, doc) => {
                if (err) reject(err);

                client.close();
                resolve(true);
            })
        });
    }

    protected async insertMany(name: string, insertArray: any[]) {
        let { db, client } = await this.connect();
        let collection = this.collection(db, name);

        return new Promise((resolve, reject) => {
            try {
                collection.insertMany(insertArray, (data) => {
                    client.close();
                    resolve(true);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

}

export { model };