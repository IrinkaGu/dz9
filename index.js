var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/base_mongo';
const dataJson = require('./data');

function loadData(dataJson){
	var res = [];
	dataJson.map(
		obj => res.push(obj)
	);
	
	return res;
}

const find = (collection, callback) => {
    collection.find().toArray((err, items) => {
        if (err) return console.error(err);
        console.log(items);
        callback();
    });
}

MongoClient.connect(url, function (err, db){
	if (err){
		console.log("Невозможно подключиться к базе данных ", err);
	} else {
		console.log("Соединение установлено для ", url);
		var name_insert = loadData(dataJson);
		var collection = db.collection("names");
	
		collection.insert( name_insert, function (err, result){
			if (err){
				console.log(err);
			} else {
				console.log("Добавлено: ");
				console.log(result.ops);
				collection.update({ age: { $lt: 18}}, {$set: {name: 'Удалить'}}, {multi: true}, function (err, result) {
					if (err){
						console.log(err);
					} else {
						console.log("Младше 18 лет помечены на удаление: ");
						find(collection, () => {	
							collection.remove({name: 'Удалить'}, function(err, result) {
								console.log("Помеченные на удаление удалены: ");
								find(collection, () => {
									collection.remove();
									db.close();
								});
							});
						});
					}
				});
			}
		});

	}
});