require('dotenv').config()

const express = require('express')
const session = require('express-session')
const expressLayout = require('express-ejs-layouts')
const connectDB = require('./server/config/db')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const {isRouteActive} = require('./server/helpers/routeHelpers')

const app = express()
const port = 3000 || process.env.PORT

connectDB()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
}))

app.use(express.static('public'))

//template
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.locals.isRouteActive = isRouteActive

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))
app.use('/', require('./server/routes/news'))
app.use('/', require('./server/routes/dictionary'))

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})