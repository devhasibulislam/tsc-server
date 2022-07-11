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

        // add new teacher
        app.post('/teacher', async (req, res) => {
            res.send(await teacherCollection.insertOne(req.body));
        });

        // get all teachers
        app.get('/teachers', async (req, res) => {
            res.send(await teacherCollection.find({}).toArray());
        })

        // delete a teacher
        app.delete('/teacher/:id', async (req, res) => {
            res.send(await teacherCollection.deleteOne({ _id: ObjectId(req.params.id) }));
        })

        // update a teacher
        app.put('/teacher/:id', async (req, res) => {
            res.send(await teacherCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, { upsert: true }));
        })

        // count total teachers
        app.get('/teachersCount', async (req, res) => {
            res.send({ totalTeachers: await teacherCollection.estimatedDocumentCount() });
        })

        /**
         * STUDENT segment
         */

        // add new student
        app.post('/student', async (req, res) => {
            res.send(await studentCollection.insertOne(req.body));
        });

        // get all students
        app.get('/students', async (req, res) => {
            res.send(await studentCollection.find({}).skip(parseInt(req.query.page) * 5).limit(5).toArray());
        })

        // delete a student
        app.delete('/student/:id', async (req, res) => {
            res.send(await studentCollection.deleteOne({ _id: ObjectId(req.params.id) }));
        })

        // update a student
        app.put('/student/:id', async (req, res) => {
            res.send(await studentCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, { upsert: true }));
        })

        // count total students
        app.get('/studentsCount', async (req, res) => {
            res.send({ totalStudents: await studentCollection.estimatedDocumentCount() });
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
