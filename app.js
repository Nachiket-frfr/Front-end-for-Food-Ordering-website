import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'template')));

app.post('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'template', 'index.html'));
});

app.post('/', (req, res) => {
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'login.html'));
});

app.post('/login', (req, res) => {
    res.redirect('/login')
});

app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'sign-up.html'));
});

app.get('/Account', (req,res)=>{
    res.sendFile(path.join(__dirname,'template','acc.html'));
});

app.get('/logout',(req,res)=>{
    if(req.session){
        req.session.destroy()
    }

    res.redirect('/')
});

app.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});