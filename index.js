// required middleware
const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// connect middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongodb connectivity

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tsc.pcq06.mongodb.net/?retryWrites=true&w=majority`;
const database = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await database.connect();
        const teacherCollection = database.db("tsc").collection("teachers");
        const studentCollection = database.db("tsc").collection("students");
        const todoCollection = database.db("tsc").collection("todo");
        const departmentCollection = database.db("tsc_static").collection("departments");
        const divisionCollection = database.db("tsc_static").collection("divisions");
        const schoolCollection = database.db("tsc_static").collection("schools");
        const classCollection = database.db("tsc_static").collection("classes");
        console.log('TSC server connected with MongoDB.');

        // get departments name
        app.get('/departments', async (req, res) => {
            res.send(await departmentCollection.find({}).toArray());
        })

        // get divisions name
        app.get('/divisions', async (req, res) => {
            res.send(await divisionCollection.find({}).toArray());
        })

        // get schools name
        app.get('/schools', async (req, res) => {
            res.send(await schoolCollection.find({}).toArray());
        })

        // get classes number
        app.get('/classes', async (req, res) => {
            res.send(await classCollection.find({}).toArray());
        })

        /**
         * TEACHER segment
         */

        // add new teacher => C
        app.post('/teacher', async (req, res) => {
            res.send(await teacherCollection.insertOne(req.body));
        });

        // get all teachers => R
        app.get('/teachers', async (req, res) => {
            res.send(await teacherCollection.find({}).skip(parseInt(req.query.page) * 5).limit(5).toArray());
        })

        // update a teacher => U
        app.put('/teacher/:id', async (req, res) => {
            res.send(await teacherCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, { upsert: true }));
        })

        // delete a teacher => D
        app.delete('/teacher/:id', async (req, res) => {
            res.send(await teacherCollection.deleteOne({ _id: ObjectId(req.params.id) }));
        })

        // count total teachers
        app.get('/teachersCount', async (req, res) => {
            res.send({ totalTeachers: await teacherCollection.estimatedDocumentCount() });
        })

        /**
         * STUDENT segment
         */

        // add new student => C
        app.post('/student', async (req, res) => {
            res.send(await studentCollection.insertOne(req.body));
        });

        // get all students => R
        app.get('/students', async (req, res) => {
            res.send(await studentCollection.find({}).skip(parseInt(req.query.page) * 5).limit(5).toArray());
        })

        // update a student => U
        app.put('/student/:id', async (req, res) => {
            res.send(await studentCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, { upsert: true }));
        })

        // delete a student => D
        app.delete('/student/:id', async (req, res) => {
            res.send(await studentCollection.deleteOne({ _id: ObjectId(req.params.id) }));
        })

        // count total students
        app.get('/studentsCount', async (req, res) => {
            res.send({ totalStudents: await studentCollection.estimatedDocumentCount() });
        })

        /**
         * TODO segment
         */

        // add new todo => C
        app.post('/todo', async (req, res) => {
            res.send(await todoCollection.insertOne(req.body));
        })

        // get all todo => R
        app.get('/todo', async (req, res) => {
            res.send(await todoCollection.find({}).toArray());
        })

        // update a todo => U
        app.put('/todo/:id', async (req, res) => {
            res.send(await todoCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, { upsert: true }));
        })

        // delete a todo => D
        app.delete('/todo/:id', async (req, res) => {
            res.send(await todoCollection.deleteOne({ _id: ObjectId(req.params.id) }));
        })
    } finally {
        // await database.close();
    }
} run().catch(console.dir);


// enable requests
app.get('/', (req, res) => {
    res.send(`<h1 align="center">TSC server successfully connected.</h1>`);
})

app.listen(port, () => {
    console.log(`TSC server listening on port ${port}.`);
})
