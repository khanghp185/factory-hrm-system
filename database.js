const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeTables();
    }
});

function initializeTables() {
    db.serialize(() => {
        // Employees table
        db.run(`CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            position TEXT,
            department TEXT,
            status TEXT DEFAULT 'Đang làm việc',
            join_date DATE
        )`);

        // Shifts table
        db.run(`CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shift_name TEXT NOT NULL,
            start_time TIME,
            end_time TIME
        )`, () => {
            // Seed shifts if empty
            db.get("SELECT COUNT(*) as count FROM shifts", (err, row) => {
                if (row && row.count === 0) {
                    db.run("INSERT INTO shifts (shift_name, start_time, end_time) VALUES ('Sáng', '06:00', '14:00')");
                    db.run("INSERT INTO shifts (shift_name, start_time, end_time) VALUES ('Chiều', '14:00', '22:00')");
                    db.run("INSERT INTO shifts (shift_name, start_time, end_time) VALUES ('Đêm', '22:00', '06:00')");
                }
            });
        });

        // Schedules table
        db.run(`CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            shift_id INTEGER,
            work_date DATE,
            is_backup BOOLEAN DEFAULT 0,
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (shift_id) REFERENCES shifts(id)
        )`);

        // LeaveRequests table
        db.run(`CREATE TABLE IF NOT EXISTS leave_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            start_date DATE,
            end_date DATE,
            reason TEXT,
            status TEXT DEFAULT 'Chờ duyệt',
            FOREIGN KEY (employee_id) REFERENCES employees(id)
        )`);

        // Documents table
        db.run(`CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT,
            file_path TEXT,
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

module.exports = db;
