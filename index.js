const express = require('express')
const HTTP_SERVER = express()
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5000
require('./dbConfig')

HTTP_SERVER.use(express.json())
HTTP_SERVER.use(express.urlencoded({extended:false}))
HTTP_SERVER.use(cors())


HTTP_SERVER.use(
  "/Media/Data/Image",
  express.static(path.join(process.cwd(), "Media", "Data", "Image"))
);

HTTP_SERVER.use(
  "/Media/Data/Song",
  express.static(path.join(process.cwd(), "Media", "Data", "Song"))
);


HTTP_SERVER.get('/',(req,res)=>{
res.send("Server is running")
})

HTTP_SERVER.listen(PORT,()=>{

    console.log(`Server is running on port ${PORT}`)
})

HTTP_SERVER.use('/',require('./app'))