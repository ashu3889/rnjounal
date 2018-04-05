var express = require('express');
var app = express();
var bodyparser = require('body-parser');
//var busboyBodyParser = require('busboy-body-parser');
var cors = require('cors');
var morgan = require('morgan');

var multer= require('multer');
var upload = multer({dest :'uploads/'});

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
//app.use(busboyBodyParser());
app.use(express.static(__dirname + '/public'));




//setup mongoose connection
var mongoose= require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://ashu3889:amma2011@ds161410.mlab.com:61410/pagination');
var db = mongoose.connection;

//connect gridfs and mongodb

//file upload module
var path = require('path');
var Grid = require('gridfs-stream');
var fs = require('fs');
//var imagepath = path.join(__dirname , "pexels-photo-383838.jpeg");

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);


app.route('/upload').post(function(req, res) {
	
	    	var part = req.files.myfile;
 
                var writeStream = gfs.createWriteStream({
                    filename: part.name,
    				mode: 'w',
                    content_type:part.mimetype
                }); 
 
                writeStream.on('close', function() {
                     return res.status(200).send({
						message: 'Success'
					});
                });                
                writeStream.write(part.data); 
                writeStream.end();
 
});

app.route('/upload/:filename').get(function(req, res) {
 
	gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
 
 	    if(files.length===0){
			return res.status(400).send({
				message: 'File not found'
			});
 	    }
	
		/*res.writeHead(200, {'Content-Type': files[0].contentType});
		
		var readstream = gfs.createReadStream({
			  filename: files[0].filename
		});
 
	    readstream.on('data', function(data) {
	        res.write(data);
	    });
	    
	    readstream.on('end', function() {
	        res.end();        
	    });
 
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});*/
		
		var rstream = gfs.createReadStream({
			  filename: files[0].filename
		});

var bufs = [];
var imagesrc  = '';

rstream.on('data', function(chunk) {

    bufs.push(chunk);

}).on('end', function() { // done

    var fbuf = Buffer.concat(bufs);

    var base64 = (fbuf.toString('base64'));

	var imagesrc = "data:" + files[0].contentType + ";base64," + base64;
    res.send(imagesrc);
});
		
		
		 console.log(imagesrc);
		
	});
 
});
	
	
/*app.route('/upload').get(function(req, res) {
 
	gfs.files.find({}).toArray(function (err, files) {
 
 	    if(files.length===0){
			return res.status(400).send({
				message: 'File not found'
			});
 	    }
	
	
	console.log('files.length' + files.length);
		res.writeHead(200, {'Content-Type': files[0].contentType});
		
		var readstream = gfs.createReadStream({
			  filename: files[1].filename
		});
 
	    readstream.on('data', function(data) {
	        res.write(data);
	    });
	    
	    readstream.on('end', function() {
	        res.end();        
	    });
 
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
	});
 
});*/

/*db.once('open' , function(){
	
	console.log('connection is opened');
	
	var gfs = Grid(db.db);
	
	
	fs.createReadStream(imagepath).pipe(writeStream);
	
	var writeStream = gfs.createWriteStream({		
		filename: 'ashimage.jpeg'
	});	
	
	writeStream.on('close' , function(file){
		console.log('file is saved to db');
		
	});
	
	//first read file to begin write
	var createReadStream = gfs.createReadStream({
		filename : 'ashimage.jpeg'
	});
	
	var createWriteStream = fs.createWriteStream(path.join(__dirname + '/public' , "downloaded.jpeg"));
	
	createReadStream.pipe(createWriteStream);
	
	createWriteStream.on('close' , function(){
		console.log('file is written to db');
	});
	
});*/


//now use mongoose to create a mongoose schema

var listSchema = mongoose.Schema({
	 name:  String,
     sref:  String
});

var paginationSchema = mongoose.Schema({
	 name:  String,
     email:  String,
	 age : Number
});

var employeeSchema = mongoose.Schema({
	 name:  String,
     address:  String,
	 age : Number
});

var tradeSchema = mongoose.Schema({
	 tradeDetail:{type : String},
     tradeMistakes:{type : String},
	 image : String,
	 comment : {type : String},
     likes : Number,

});

var listModel = mongoose.model('listMod' , listSchema);

var paginationModel = mongoose.model('paginationMod' , paginationSchema);

var employeeModel = mongoose.model('employeeMod' , employeeSchema);


var tradeModel = mongoose.model('tradeMod' , tradeSchema);





//post data on first time
/*employeeSchema.create(dummydata, function(err, docs){
	 if(err){		
		 console.log('data save error' + err);
	 }
	 else{
	 console.log('data save successfull');		
	 }

}) */

//express app setup default router
/*app.get('/' , function(req, res){
	
	res.send('hello world');
});*/


// get router to get employee data based on name
app.get('/:name' , function(req, res){
	var empName = req.params.name;

listModel.find({name :empName} , function(err, docs){
	if(err){
		console.log('error occurs');
	}
	else{
		res.send(docs);
	}	
})	
	
});

//default router called on page load to load list
app.get('/' , function(req, res){	
console.log('default route called');
listModel.find(function(err, docs){
	if(err){
		console.log('error occurs');
	}
	else{
		 res.json({ message: 'doc updated!' , docum : doc });
	}	
})	
	
});

//setup angular Router
var router = express.Router();

var employeeRouter = express.Router();

var uploadRouter = express.Router();

var uploadTradeRouter = express.Router();

 uploadTradeRouter.route('/trade').put(function(req, res) { 
 console.log('put query called');   
 
        var id = req.body._id;	
		console.log('employee id isssssss' + id);
 
    tradeModel.findById(id,function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			 console.log('doc doc name' +  doc);
				

			         doc.tradeDetail = req.body.tradeDetail,
                     doc.tradeMistakes= req.body.tradeMistakes,				
                     doc.image=  req.body.image,
                     doc.comment =  req.body.comment,
                     doc.likes =  req.body.likes
			 
			
             doc.save(function(err) {
                 if (err)
                     res.send(err);

                 res.json({ message: 'doc updated!' , docum : doc });
             });	
			
		}
		
	})
  
    });


 uploadTradeRouter.post('/trade' , upload.any() , function(req, res, next){
	
	 
	 if(req.files){		 
			 var filename = (new Date).valueOf()+"-"+ req.files[0].originalname;
			 
         fs.rename(req.files[0].path ,'public/images/'+filename, function(err){
                
				if(err) throw err;				
				var tradeData = new tradeModel({
                     tradeDetail :req.body.tradeDetail,
                     tradeMistakes:req.body.tradeMistakes,				
                     image: filename,
                     comment : req.body.comment,
                     likes : req.body.likes
                });				
				

				 tradeData.save()
                     .then(
                          function(item){
                              res.send(item);

                          })
                       .catch(function(err){
                          res.status(400).send("unable to save to database");

                     });		
                });		  
			 
	 }
 });
 
  uploadTradeRouter.get('/trade', function(req, res){
console.log('get data called');	  
      tradeModel.find(function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			console.log('success occurs');
			 res.json({ message: 'doc updated!' , docum : doc });	
		}		
	})  
});





 router.route('/:name').put(function(req, res) {
  
    var findname = req.params.name;
	var updatename = req.body.newname;	
 
    listModel.findById(req.params.name,function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			 console.log('doc doc name' +  doc);
			doc.name = updatename;
			
			 console.log('doc doc name' +  doc.name);
			//save the docs
					 // save the doc
             doc.save(function(err) {
                 if (err)
                     res.send(err);

                 res.json({ message: 'doc updated!' , docum : doc });
             });	
			
		}
		
	})
  
  });
  
  router.get('/about', function(req, res){	  
      listModel.find(function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			console.log('success occurs');
			 res.json({ message: 'doc updated!' , docum : doc });	
		}		
	})  
});


  router.get('/pagination', function(req, res){
	  
	 
      paginationModel.find(function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			console.log('success occurs');
			 res.json({ message: 'doc updated!' , docum : doc });	
		}		
	})  
});

  
  /*router.route('/').get(function(req, res) {  
   alert('here');
   employeeModel.find({"name" :"Rohan"},function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			console.log('success occurs');
			 res.json({ message: 'doc updated!' , docum : doc });	
		}		
	})  
  });*/
  
  
  employeeRouter.route('/emp').put(function(req, res) {
  
    
 
        var id = req.body._id;	
		console.log('employee id isssssss' + id);
 
    employeeModel.findById(id,function(err, doc){
		if(err){
		console.log('error occurs');
	    }
		else{
			 console.log('doc doc name' +  doc);
			doc.name = req.body.name;
			doc.address = req.body.address;
			doc.age = req.body.age;	
			 
			
             doc.save(function(err) {
                 if (err)
                     res.send(err);

                 res.json({ message: 'doc updated!' , docum : doc });
             });	
			
		}
		
	})
  
    });
  
   employeeRouter.route('/emp/:id').delete(function(req, res) {
  
       var employeeOid = req.params.id;
  
  
        employeeModel.findByIdAndRemove(employeeOid ,function(err, doc){
		            if(err){
		                console.log('error occurs');
	                }
		            else{
			           console.log('success occurs');
			           res.json({ message: 'doc updated!' , docum : doc });	
		        }		
	    })  
  
    });
  
   employeeRouter.route('/emp').get(function(req, res) {
  
        employeeModel.find(function(err, doc){
		            if(err){
		                console.log('error occurs');
	                }
		            else{
			           console.log('success occurs');
			           res.json({ message: 'doc updated!' , docum : doc });	
		        }		
	    })  
  
    });
	
	

  
  
   employeeRouter.route('/emp').post(function(req, res) {
  
    var data = req.body;
 console.log('upload pic data is called' + data);
          employeeModel.create(data, function(err, docs){
	               if(err){		
		                     console.log('data save error' + err);
	                    }
	               else{
	                     console.log('data save successfull');
                         res.json({ message: 'doc updated!' , docum : docs });		 
	         }

         });
  
    });
  
  
  

app.use('/api' , router);
app.use('/employee' , employeeRouter);
app.use('/upload' , uploadRouter);
app.use('/uploadTradeData' , uploadTradeRouter);





//var port  = process.env.PORT || 3000;

app.listen(process.env.PORT || 4000, function(){
	
	console.log('express app setup complete');
});
