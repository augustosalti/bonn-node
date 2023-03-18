const {MongoClient} = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://saltiaugusto:jT8A7E3az0WqwZng@hostelemetrica.3ka4lyk.mongodb.net/?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function insertMongoAcceso(doc) {
    const uri = "mongodb+srv://saltiaugusto:jT8A7E3az0WqwZng@hostelemetrica.3ka4lyk.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
      const database = client.db("metrica");
      const accesos = database.collection("accesos");
      // create a document to insert
      //how to add datetime value to a json for mongodb
      doc.date = new Date();
      const result = await accesos.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
}

module.exports = { insertMongoAcceso };