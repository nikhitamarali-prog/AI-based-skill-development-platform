import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Database Setup
const db = new Database("platform.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    department TEXT,
    coding_progress INTEGER DEFAULT 0,
    aptitude_progress INTEGER DEFAULT 0,
    comm_progress INTEGER DEFAULT 0,
    subscription TEXT DEFAULT 'free'
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    department TEXT,
    instructor TEXT,
    image TEXT,
    notes_url TEXT,
    video_url TEXT
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    user_id INTEGER,
    course_id INTEGER,
    PRIMARY KEY (user_id, course_id)
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    price REAL,
    seller_id INTEGER,
    department TEXT,
    image TEXT,
    location TEXT,
    stock INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    mentor_name TEXT,
    date TEXT,
    time TEXT
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS contest_registrations (
    user_id INTEGER,
    contest_id INTEGER,
    PRIMARY KEY (user_id, contest_id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contest_id INTEGER,
    question TEXT,
    options TEXT, -- JSON string
    correct_option INTEGER
  );
`);

// Migration: Ensure location and stock columns exist in books table
try {
  db.exec("ALTER TABLE books ADD COLUMN location TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE books ADD COLUMN stock INTEGER DEFAULT 1");
} catch (e) {}

// Migration: Ensure notes_url and video_url columns exist in courses table
try {
  db.exec("ALTER TABLE courses ADD COLUMN notes_url TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE courses ADD COLUMN video_url TEXT");
} catch (e) {}

// Seed data if empty
const courseCount = db.prepare("SELECT COUNT(*) as count FROM courses").get() as { count: number };
if (courseCount.count === 0) {
  const insertCourse = db.prepare("INSERT INTO courses (title, description, department, instructor, image, notes_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
  
  const notes = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const video = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder video

  // CSE
  insertCourse.run("Data Structures & Algorithms", "Master arrays, linked lists, trees, and graphs.", "CSE", "Prof. Alan", "https://picsum.photos/seed/dsa/400/250", notes, "https://www.youtube.com/embed/8hly31xKli0");
  insertCourse.run("Java Programming", "Learn core Java and object-oriented principles.", "CSE", "Dr. Smith", "https://picsum.photos/seed/java/400/250", notes, "https://www.youtube.com/embed/eIrMb6n6n8E");
  insertCourse.run("Database Management Systems", "SQL, normalization, and database design.", "CSE", "Prof. Sarah", "https://picsum.photos/seed/dbms/400/250", notes, "https://www.youtube.com/embed/HXV3zeQKqGY");
  insertCourse.run("Object Oriented Programming", "Classes, inheritance, and polymorphism.", "CSE", "Dr. Robert", "https://picsum.photos/seed/oops/400/250", notes, "https://www.youtube.com/embed/pTB0EiLXUC8");
  insertCourse.run("Operating Systems", "Process management, memory, and file systems.", "CSE", "Prof. Kim", "https://picsum.photos/seed/os/400/250", notes, "https://www.youtube.com/embed/vBURTt97EkA");

  // ECE
  insertCourse.run("Digital Logic Design", "Boolean algebra, gates, and flip-flops.", "ECE", "Prof. Jane", "https://picsum.photos/seed/logic/400/250", notes, "https://www.youtube.com/embed/CeD2L6KbtVM");
  insertCourse.run("VLSI Design", "CMOS technology and chip fabrication.", "ECE", "Dr. Robert", "https://picsum.photos/seed/vlsi/400/250", notes, "https://www.youtube.com/embed/9SnR3M3C34I");
  insertCourse.run("Microprocessors", "Architecture and assembly language.", "ECE", "Prof. Kim", "https://picsum.photos/seed/micro/400/250", notes, "https://www.youtube.com/embed/CeD2L6KbtVM");
  insertCourse.run("Signals & Systems", "Fourier transforms and signal analysis.", "ECE", "Eng. Dave", "https://picsum.photos/seed/signals/400/250", notes, "https://www.youtube.com/embed/CeD2L6KbtVM");

  // MBA
  insertCourse.run("Business Analytics", "Data-driven decision making.", "MBA", "Dr. Miller", "https://picsum.photos/seed/analytics/400/250", notes, video);
  insertCourse.run("Financial Management", "Corporate finance and investment.", "MBA", "Prof. Alice", "https://picsum.photos/seed/finance/400/250", notes, video);
  insertCourse.run("Marketing Strategy", "Brand building and market research.", "MBA", "Dr. Wilson", "https://picsum.photos/seed/marketing/400/250", notes, video);

  // Mechanical
  insertCourse.run("Thermodynamics", "Energy, heat, and work principles.", "Mechanical", "Eng. Brown", "https://picsum.photos/seed/mech/400/250", notes, video);
  insertCourse.run("Manufacturing Process", "Casting, welding, and machining.", "Mechanical", "Dr. White", "https://picsum.photos/seed/cad/400/250", notes, video);
  insertCourse.run("Machine Design", "Design of mechanical components.", "Mechanical", "Prof. Stark", "https://picsum.photos/seed/robotics/400/250", notes, video);

  // Civil
  insertCourse.run("Structural Engineering", "Analysis of beams, columns, and frames.", "Civil", "Dr. Lee", "https://picsum.photos/seed/civil/400/250", notes, video);
  insertCourse.run("Surveying", "Measurement and mapping of land.", "Civil", "Eng. Stone", "https://picsum.photos/seed/survey/400/250", notes, video);
  insertCourse.run("Hydraulics", "Fluid flow in pipes and channels.", "Civil", "Prof. Green", "https://picsum.photos/seed/water/400/250", notes, video);
}

const bookCount = db.prepare("SELECT COUNT(*) as count FROM books").get() as { count: number };
if (bookCount.count === 0) {
  const insertBook = db.prepare("INSERT INTO books (title, price, seller_id, department, image, location, stock) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertBook.run("Cracking the Coding Interview", 450, 1, "CSE", "https://picsum.photos/seed/ctci/300/400", "Library", 5);
  insertBook.run("Introduction to Algorithms", 800, 1, "CSE", "https://picsum.photos/seed/clrs/300/400", "Block A", 0); // Out of stock
  insertBook.run("Principles of Management", 300, 2, "MBA", "https://picsum.photos/seed/mgmt/300/400", "MBA Block", 2);
  insertBook.run("Structural Analysis", 550, 2, "Civil", "https://picsum.photos/seed/struct/300/400", "Civil Dept", 1);
}

const contestCount = db.prepare("SELECT COUNT(*) as count FROM contests").get() as { count: number };
if (contestCount.count === 0) {
  const insertContest = db.prepare("INSERT INTO contests (title, date, description) VALUES (?, ?, ?)");
  insertContest.run("Weekly Aptitude Challenge #1", "2026-03-05", "Test your logical reasoning and quantitative skills.");
  insertContest.run("Bi-Weekly Coding Sprint", "2026-03-12", "Solve 5 algorithmic problems in 2 hours.");
}

const questionCount = db.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
if (questionCount.count === 0) {
  const insertQuestion = db.prepare("INSERT INTO questions (contest_id, question, options, correct_option) VALUES (?, ?, ?, ?)");
  
  // Questions for Contest 1 (Aptitude)
  const q1 = [
    { q: "What is the next number in the sequence: 2, 6, 12, 20, 30, ...?", o: ["36", "40", "42", "48"], c: 2 },
    { q: "If a train travels 60 km in 45 minutes, what is its speed in km/h?", o: ["75", "80", "90", "100"], c: 1 },
    { q: "A father is 3 times as old as his son. In 12 years, he will be twice as old. How old is the son now?", o: ["10", "12", "15", "18"], c: 1 },
    { q: "Which word does not belong with the others?", o: ["Leopard", "Cougar", "Tiger", "Wolf"], c: 3 },
    { q: "If 5 workers can build a wall in 12 days, how many days will 10 workers take?", o: ["4", "6", "8", "10"], c: 1 },
    { q: "What is 15% of 200?", o: ["20", "25", "30", "35"], c: 2 },
    { q: "Find the odd one out.", o: ["Square", "Circle", "Rectangle", "Triangle"], c: 1 },
    { q: "If RED is coded as 27, how is BLUE coded?", o: ["36", "40", "44", "48"], c: 1 },
  ];

  q1.forEach(item => {
    insertQuestion.run(1, item.q, JSON.stringify(item.o), item.c);
  });

  // Questions for Contest 2 (Coding Sprint)
  const q2 = [
    { q: "What is the time complexity of searching in a balanced BST?", o: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], c: 2 },
    { q: "Which data structure uses LIFO principle?", o: ["Queue", "Stack", "Linked List", "Array"], c: 1 },
    { q: "What is the result of 5 + '5' in JavaScript?", o: ["10", "55", "Error", "NaN"], c: 1 },
    { q: "Which keyword is used to define a constant in JS?", o: ["var", "let", "const", "static"], c: 2 },
  ];
  q2.forEach(item => {
    insertQuestion.run(2, item.q, JSON.stringify(item.o), item.c);
  });
}

// API Routes

// Auth
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, department } = req.body;
  try {
    const info = db.prepare("INSERT INTO users (name, email, password, department) VALUES (?, ?, ?, ?)").run(name, email, password, department);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, user });
  } catch (e) {
    res.status(400).json({ success: false, message: "Email already exists" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Courses
app.get("/api/courses", (req, res) => {
  const { department } = req.query;
  let courses;
  if (department) {
    courses = db.prepare("SELECT * FROM courses WHERE department = ?").all(department);
  } else {
    courses = db.prepare("SELECT * FROM courses").all();
  }
  res.json(courses);
});

app.post("/api/courses/enroll", (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    db.prepare("INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)").run(user_id, course_id);
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: "Already enrolled" });
  }
});

// Books
app.get("/api/books", (req, res) => {
  const books = db.prepare("SELECT * FROM books").all();
  res.json(books);
});

app.post("/api/books", (req, res) => {
  const { title, price, seller_id, department, image, location, stock } = req.body;
  db.prepare("INSERT INTO books (title, price, seller_id, department, image, location, stock) VALUES (?, ?, ?, ?, ?, ?, ?)").run(title, price, seller_id, department, image, location, stock || 1);
  res.json({ success: true });
});

app.post("/api/books/buy", (req, res) => {
  const { book_id } = req.body;
  const book = db.prepare("SELECT stock FROM books WHERE id = ?").get(book_id) as any;
  if (book && book.stock > 0) {
    db.prepare("UPDATE books SET stock = stock - 1 WHERE id = ?").run(book_id);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Out of stock" });
  }
});

app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  console.log(`Attempting to delete book ${id} by user ${user_id}`);
  
  // Verify ownership
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id) as any;
  if (!book) {
    console.log(`Book ${id} not found`);
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  
  if (Number(book.seller_id) !== Number(user_id)) {
    console.log(`Unauthorized delete attempt: Book seller ${book.seller_id} vs User ${user_id}`);
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  db.prepare("DELETE FROM books WHERE id = ?").run(id);
  console.log(`Book ${id} deleted successfully`);
  res.json({ success: true });
});

// Sessions
app.post("/api/sessions", (req, res) => {
  const { user_id, mentor_name, date, time } = req.body;
  db.prepare("INSERT INTO sessions (user_id, mentor_name, date, time) VALUES (?, ?, ?, ?)").run(user_id, mentor_name, date, time);
  res.json({ success: true });
});

// Feedback
app.post("/api/feedback", (req, res) => {
  const { user_id, content } = req.body;
  db.prepare("INSERT INTO feedback (user_id, content) VALUES (?, ?)").run(user_id, content);
  res.json({ success: true });
});

// Contests
app.get("/api/contests", (req, res) => {
  const { user_id } = req.query;
  const contests = db.prepare("SELECT * FROM contests").all() as any[];
  
  if (user_id) {
    const registrations = db.prepare("SELECT contest_id FROM contest_registrations WHERE user_id = ?").all(user_id) as any[];
    const registeredIds = registrations.map(r => r.contest_id);
    contests.forEach(c => {
      c.registered = registeredIds.includes(c.id);
    });
  }
  
  res.json(contests);
});

app.post("/api/contests/register", (req, res) => {
  const { user_id, contest_id } = req.body;
  try {
    db.prepare("INSERT INTO contest_registrations (user_id, contest_id) VALUES (?, ?)").run(user_id, contest_id);
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: "Already registered" });
  }
});

app.get("/api/contests/:id/questions", (req, res) => {
  const { id } = req.params;
  const questions = db.prepare("SELECT * FROM questions WHERE contest_id = ?").all(id) as any[];
  questions.forEach(q => {
    q.options = JSON.parse(q.options);
  });
  res.json(questions);
});

// User Progress Update (Mock for demo)
app.post("/api/user/update-progress", (req, res) => {
  const { user_id, type, value } = req.body;
  const column = type === 'coding' ? 'coding_progress' : type === 'aptitude' ? 'aptitude_progress' : 'comm_progress';
  db.prepare(`UPDATE users SET ${column} = ? WHERE id = ?`).run(value, user_id);
  res.json({ success: true });
});

// Vite Middleware
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
