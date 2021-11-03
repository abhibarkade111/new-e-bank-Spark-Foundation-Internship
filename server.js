
const express = require('express')
const app =express()
const PORT = 3000
const path = require('path')
const mongoose = require('mongoose')


app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin:barkade111@cluster0.svn0o.mongodb.net/EBank?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  }
);



const CustomerSchema = new mongoose.Schema({
  fname: String,
  AccBalance: String,
  phNumber: String,
  emails: String,
  city: String

});


const Customer = mongoose.model('Customers',CustomerSchema);

const TransferSchema = new mongoose.Schema({
  transferFrom: String,
  transferTo: String,
  transferMoney: String

});


const Transfer = mongoose.model('TransferHistory',TransferSchema);

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded())
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/customers', (req, res) => {
  Customer.find({}, function(err,customers){
    res.render('customer',{
      customersList: customers
    })
  })
  
})

app.get('/transfer', (req, res) => {
  Customer.find({}, function(err,customers){
    res.render('transferMoney',{
      customersList: customers
    })
  })
})

app.get('/user', (req, res) => {
  res.render('user')
})

app.get('/history', (req, res) => {
  Transfer.find({}, function(err,transferH){
    res.render('transferHistory',{
      TransferHistorysList: transferH
    })
  })
 
})
// app.get('/', (req, res)=> {
//   // do something w/ req.body or req.files 
// });

app.post('/user',(req,res)=>{
  var myData = new Customer(req.body);
  if(myData.fname!=""&&myData.phNumber!=""&&myData.AccBalance!=""&&myData.emails!=""&&myData.city!=""){
  myData.save().then(()=>{
    res.redirect('/user')
  }).catch(()=>{
    res.status(400).send("Not Saved")
  });
}
else{
  res.redirect('/user')
}
 
})

app.post('/transfer',(req,res)=>{
  var myData = new Transfer(req.body);
  if(myData.transferMoney!=""){
  myData.save().then(()=>{
    res.redirect('/transfer')
  }).catch(()=>{
    res.status(400).send("Not Saved")
  });
}
else{
  res.redirect('/transfer')
}
 
})



const connection = mongoose.connection;
mongoose.connection.on('connected', ()=>{
  console.log("Connected ")
})

mongoose.connection.on('error', (err)=>{
  console.log("error connecting", err)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})


// connection.on("error", console.error.bind(console, "connection error: "));
// connection.once("open", function () {
//   console.log("Connected successfully");
// });
