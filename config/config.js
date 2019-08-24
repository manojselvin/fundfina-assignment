const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
} else if (env === 'test') {
    process.env.PORT = 3000;
}

const database = {
    host: 'localhost',
    user: 'manojselvin',
    password: '123456',
    port: 3306,
    database: 'fundfina'
};

const port = process.env.PORT;

module.exports = {
    port, database
};