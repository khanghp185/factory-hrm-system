const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// We'll create separate route files later, but for now, let's add some basic endpoints

// Employee Routes
app.get('/api/employees', (req, res) => {
    db.all("SELECT * FROM employees", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/employees', (req, res) => {
    const { full_name, position, department, join_date } = req.body;
    db.run(`INSERT INTO employees (full_name, position, department, join_date) VALUES (?, ?, ?, ?)`,
        [full_name, position, department, join_date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Shift Routes
app.get('/api/shifts', (req, res) => {
    db.all("SELECT * FROM shifts", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Schedule Routes
app.get('/api/schedules', (req, res) => {
    const query = `
        SELECT s.*, e.full_name as employee_name, sh.shift_name 
        FROM schedules s
        JOIN employees e ON s.employee_id = e.id
        JOIN shifts sh ON s.shift_id = sh.id
        ORDER BY s.work_date DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/schedules', (req, res) => {
    const { employee_id, shift_id, work_date, is_backup } = req.body;
    db.run(`INSERT INTO schedules (employee_id, shift_id, work_date, is_backup) VALUES (?, ?, ?, ?)`,
        [employee_id, shift_id, work_date, is_backup ? 1 : 0],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Leave Request Routes
app.get('/api/leave', (req, res) => {
    const query = `
        SELECT l.*, e.full_name as employee_name 
        FROM leave_requests l
        JOIN employees e ON l.employee_id = e.id
        ORDER BY l.start_date DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/leave', (req, res) => {
    const { employee_id, start_date, end_date, reason } = req.body;
    db.run(`INSERT INTO leave_requests (employee_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)`,
        [employee_id, start_date, end_date, reason],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Document Routes
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/api/documents', (req, res) => {
    db.all("SELECT * FROM documents ORDER BY upload_date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/documents', upload.single('file'), (req, res) => {
    const { title, category } = req.body;
    const file_path = req.file ? req.file.path : null;
    db.run(`INSERT INTO documents (title, category, file_path) VALUES (?, ?, ?)`,
        [title, category, file_path],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Database Management Routes (Admin Only)
app.get('/api/admin/tables', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.name));
    });
});

app.post('/api/admin/query', (req, res) => {
    const { sql, params } = req.body;
    const action = sql.trim().split(' ')[0].toUpperCase();
    
    if (action === 'SELECT') {
        db.all(sql, params || [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else {
        db.run(sql, params || [], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ changes: this.changes, lastID: this.lastID });
        });
    }
});

app.get('/api/admin/table/:name', (req, res) => {
    db.all(`SELECT * FROM ${req.params.name}`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Dashboard Stats
app.get('/api/stats', (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
        stats.totalEmployees = row.count;
        db.get("SELECT COUNT(*) as count FROM schedules WHERE work_date = date('now')", (err, row) => {
            stats.activeToday = row.count;
            db.get("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'Chờ duyệt'", (err, row) => {
                stats.pendingLeave = row.count;
                res.json(stats);
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
