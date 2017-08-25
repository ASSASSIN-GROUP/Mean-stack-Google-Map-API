var mongoose = require('mongoose');
var User =  require('./model.js');

module.exports = function(app) {

    app.get('/users', function(req, res) {
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });
    });

    app.post('/users', function(res, req){
        var newuser = new User(req.body);
        newuser.save(function(err){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });

    app.post('/query/', function(req, res){
        var lat = req.body.latitude;
        var long = req.body.longitude;
        var distance = req.body.distance;
        var male = req.body.male;
        var female = req.body.female;
        var other = req.body.other;
        var minAge = req.body.minAge;
        var maxAge = req.body.maxAge;
        var favLang = req.body.favLang;
        var reqVerified = req.body.reqVerified;

        var query = User.find({});
        if(distance){
            query = query.where('location').near({center: {type: 'Point', coordinateds: [long, lat]},
                maxDistance: distance * 1609.34, spherical: ture});
        }
        if(male || female || other){
            query.or([{'gender': male}, {'gender': female}, {'gender': other}]);
        }
        if(minAge){
            query = query.where('age').gte(minAge);
        }
        if(maxAge){
            query = query.where('age').lte(maxAge);
        }
        if(favLang){
            query = query.where('favlang').equals(favLang);
        }

        if(reqVerified){
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        query.exec(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });
    });

    app.delete('/users/:objID', function(req, res){
        var objID = req.params.objID;
        var update = req.body;

        User.findByIdAndRemove(objID, update, function(err, user){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });
};