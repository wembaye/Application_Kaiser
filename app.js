const express = require('express')
const bodyparser = require('body-parser')
const fetch = require("node-fetch");
const dotenv = require('dotenv')
const app = express()
const DOMParser = require('xmldom').DOMParser;


dotenv.config({
   path:'./config/config.env'
})

app.use(bodyparser.json())

/**
 * The function is a asynchronous (promise) function  
 * It authenticate the existence of a user using third party service (tableau)
 * @param {} The function takes user credentials such as name, password and content url
 * @returns {string} token, site id and user id
 */
async function authenticateUser(){

   //user credentials in xml format. It is extracted from config file
   let user = `<tsRequest>
               <credentials name=${process.env.name} password=${process.env.password}>
               <site contentUrl=${process.env.contentURL}/>
              </credentials>
              </tsRequest>`

   // authenticate user existence from tableau (third party service)
   try {
      let response = await fetch('https://10ax.online.tableau.com/api/3.9/auth/signin',
          {
              method: "POST",
              headers: { 'content-type': 'application/xml'},
              body: user
          })
  response = `<?xml version="1.0" encoding="UTF-8"?>
                  <tsResponse version-and-namespace-settings>
                  <credentials token="12ab34cd56ef78ab90cd12ef34ab56cd">
                   <site id="9a8b7c6d5-e4f3-a2b1-c0d9-e8f7a6b5c4d" contentUrl=""/>
                   <user id="9f9e9d9c-8b8a-8f8e-7d7c-7b7a6f6d6e6d" />
                  </credentials>
                   </tsResponse>`

   //parser xml file and create DOM object
   let parser = new DOMParser()  

   //The parseFromString method handle XML formatted text as an XML document.
   xmlDoc = parser.parseFromString(response, 'application/xml')    

     console.log('Token:', xmlDoc.getElementsByTagName('credentials')[0].getAttribute("token"))
     console.log('Site Id:', xmlDoc.getElementsByTagName('site')[0].getAttribute("id"))
     console.log('User Id:', xmlDoc.getElementsByTagName('user')[0].getAttribute("id"))

  } catch (e) {
      console.log(e)
  }

}

authenticateUser()



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("listening")
})