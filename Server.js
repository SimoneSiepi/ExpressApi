const express=require('express');//importo il framework Express
const app=express();
const fs = require('fs'); //importo il modulo per la gestione del File System
const morgan=require('morgan');  //importo il modulo per la gestione dei logger
const path = require('path'); //importo il modulo per la gestione dei percorsi delle cartelle e dei file
const helmet=require('helmet'); //importo il modulo per rendere il server web piu sicuro
const cors=require('cors');// Cors (protocollo che permette il passaggio di dati tra applicazioni e domini diversi)
const bodyParser = require('body-parser');
const port = 3000;

const ApiKay=require('./api'); // è uno oggetto che contiene la mia api key
//console.log(ApiKay);
const urlMafieVolpi = "https://mafieitaliane.onrender.com"
const urlNewsMafie = "https://gnews.io/api/v4/search?q=mafia&lang=it&country=it&max=10&"+ ApiKay.MY_API_KEY;

//console.log("url: "+urlNewsMafie);

const rottaPublic = path.join(__dirname, "public");

app.set ('appName', 'Web Service mafioso'); //imposta il nome dell'applicazione web
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//midleware

app.use(express.static('public'));
app.use(morgan('short', { stream: accessLogStream }));
app.use(helmet());
app.use(cors());

app.get("/",(req,res)=>{
    res.sendFile(path.join(rottaPublic,'index.html'));
});

app.get("/mafie", async (req,res)=>{
    try {
        const risposta = await fetch(urlMafieVolpi+"/mafie");
        const data = await risposta.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero delle mafie');
    }
});


app.get("/dettagliMafie", async (req,res)=>{
    try {
        const risposta = await fetch(urlMafieVolpi+"/dettagli");
        const data = await risposta.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero dei dettagli');
    }
});

app.get("/AttentatiMafie", async (req,res)=>{
    try {
        const risposta = await fetch(urlMafieVolpi+"/attentati");
        const data = await risposta.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero degli attentati');
    }
});

app.get("/mafiaNews", async (req,res)=>{
    try {
        const risposta = await fetch(urlNewsMafie);
        const data = await risposta.json();
        console.log("news: ",data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero delle news mafiose');
    }
});

app.get("/mafiaNews/:id", async (req, res) => {
    try {
        const posizione = parseInt(req.params.id);
        const risposta = await fetch(urlNewsMafie);
        const data = await risposta.json();

        if (data.articles && Array.isArray(data.articles)) {
            // Trova l'indice dell'articolo che corrisponde all'ID fornito
            const index = data.articles.findIndex((articolo, i) => i == posizione);
            console.log(index);

            if (index !== -1) {
                // Se l'indice è valido, restituisci l'articolo corrispondente
                res.json(data.articles[index]);
            } else {
                // Se l'indice non è valido, significa che l'articolo non è stato trovato
                res.status(404).json("Articolo non trovato");
            }
        } else {
            console.error('Dati non in formato array:', data);
            res.status(500).send('Errore nel recupero delle news mafiose');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero delle news mafiose');
    }
});

app.get("/mafiaNews/title/:keyWord", async (req,res)=>{
    try {
        const keyWord = req.params.keyWord;
        const risposta = await fetch(urlNewsMafie);
        const data = await risposta.json();
        let articolo = data.articles.filter(articolo=>articolo.title.includes(keyWord));
        if (articolo) {
            res.json(articolo);   
        }else{
            res.status(404).json("sito non trovato");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero delle news mafiose');
    }
});





app.listen(port, () => console.log(`Server avviato su http://localhost:${port}`));
