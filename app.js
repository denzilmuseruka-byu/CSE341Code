const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6210e801baca5f31821502a1')
        .then(user => {
            req.user = user;
            console.log(user);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        'mongodb+srv://DenzilMuseruka:DenzilMuseruka@cluster0.acj9p.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Denzil Museruka',
                    email: 'denzilmuseruka@byui.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        console.log('connecting to port', port);
        app.listen(port);
    })
    .catch(err => {
        console.log(err);
    });