const express = require('express');
const axios = require('axios');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

// Read OpenAPI YAML file
const openapiSpecification = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sopnodeserver'
};


const username = 'sopnodeserver';
const password = 'sopnodeserver';
const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

const PHP_API_BASE_URL = 'http://localhost/smarthome2v';

const connection = mysql.createConnection(dbConfig);

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'qwertzuiopasdfghjklyxcvbnm', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ message: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(query, [username, hashedPassword], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send({ message: 'Username already taken' });
                } else {
                    return res.status(500).send({ message: 'Error registering new user' });
                }
            }
            res.status(201).send({ message: 'User successfully registered', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error retrieving user' });
        }

        if (results.length === 0) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const user = results[0];

        try {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ username: user.username }, 'qwertzuiopasdfghjklyxcvbnm', { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Login error' });
        }
    });
});



app.get('/devices/:id', authenticate, async (req, res) => {
    try {
        const response = await axios.get(`${PHP_API_BASE_URL}/devices/${req.params.id}`, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });

        res.json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { message: 'Internal Server Error' };
        res.status(status).json(data);
    }
});

app.put('/devices/:id', authenticate, async (req, res) => {
    try {
        const response = await axios.put(`${PHP_API_BASE_URL}/devices/${req.params.id}`, req.body, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });

        res.json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { message: 'Internal Server Error' };
        res.status(status).json(data);
    }
});

app.delete('/devices/:id', authenticate, async (req, res) => {
    try {
        const response = await axios.delete(`${PHP_API_BASE_URL}/devices/${req.params.id}`, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });

        res.json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { message: 'Internal Server Error' };
        res.status(status).json(data);
    }
});



app.post('/devices', authenticate, async (req, res) => {
    try {
        const response = await axios.post(`${PHP_API_BASE_URL}/devices`, req.body, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.get('/devices', authenticate, async (req, res) => {
    try {
        const response = await axios.get(`${PHP_API_BASE_URL}/devices`, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    connection.end(err => {
        if (err) {
            console.error('Error during database disconnection:', err.stack);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(err ? 1 : 0);
    });
});
