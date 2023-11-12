const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); //para poder hacer puts, y tal desde el cliente al servidor
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});
// Configura el middleware CORS para que peuda recibir solicitudes de POST, PUT, DELETE, UPDATE, etc.
app.use(cors());

app.use(bodyParser.json());

const PORT = 4000;

const connection = mysql.createConnection(
    {
        host: 'localhost',
        database: 'school',
        user: 'root',
        password: '',
    }
);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

connection.connect(error => {
    if (error) throw error
    console.log("Conexión exitosa a la base de datos");
});

app.get('/', (req, res) => {
    res.send('API');
});

//endpoints
//obtener lista de estudiantes
app.get('/api/student', (req, res) => {
    const query = `SELECT *, DATE(birthdate_Student) FROM school.student`
    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay registros')
        }
    });
});

//get month of student
app.get('/api/student/quantityMonth', (req, res) => {
    const sql = `SELECT MONTHNAME(birthdate_student) AS month, COUNT(*) AS quantity
    FROM student
    GROUP BY MONTHNAME(birthdate_student), MONTH(birthdate_student)
    ORDER BY MONTH(birthdate_student);`;

    connection.query(sql, (error, result) => {
        if (error) return console.log(error.message);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay registros');
        }
    });
});

//obtener con id
app.get('/api/student/:id', (req, res) => {
    const { id } = req.params //desestructuramos el id que recibimos

    const query = `SELECT * FROM school.student WHERE id_Student = ${id}`;
    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.json('No hay registros con ese id')
        }
    })
});


//agregar estudiantes
app.post('/api/student/add', (req, res) => {
    const student = {
        name_Student: req.body.studentName,
        last_Name_Student: req.body.studentLastName,
        class_Student: req.body.studentClass,
        email_Student: req.body.studentEmail,
        dni_Student: req.body.studentDni,
        birthdate_Student: req.body.studentBirthdate,
    }

    const query = `INSERT INTO school.student SET ?`
    connection.query(query, student, (error, result) => {
        if (error) return console.log(error.message);

        res.json(`Se añadió correctament el estudiante`)
    })
});

//update student
app.put('/api/student/update/:id', (req, res) => {
    const { id } = req.params;
    const { name_Student, last_Name_Student, class_Student, email_Student, dni_Student, birthdate_Student } = req.body;
    console.log('id', id);
    console.log('body',req.body);

    const query = `UPDATE school.student SET name_Student ='${name_Student}', last_Name_Student ='${last_Name_Student}', class_Student ='${class_Student}', email_Student ='${email_Student}', dni_Student = '${dni_Student}', birthdate_Student = '${birthdate_Student}' WHERE id_Student ='${id}'`;

    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);
        res.json(`Los datos del estudiante ${name_Student} ${last_Name_Student} se actualizaron correctamente`);
    });
});

//delete student
app.delete('/api/student/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM school.student WHERE id_Student = ${id}`;
    connection.query(query, (error, result) => {
        if (error) return console.log(error.message);

        res.json(`Los datos de estudiante se eliminaron correctamente`);
    });
});


