module.exports = function(sequelize, Sequelize) {
	// Sequelize user model is initialized earlier as User
	var Product = sequelize.define('product', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
		name: { type: Sequelize.STRING},
		desc: { type: Sequelize.STRING},
		src: { type: Sequelize.STRING},
		thumb: { type: Sequelize.STRING},
		category: {type: Sequelize.ENUM('general','special'),defaultValue:'general'},
		price : {type: Sequelize.FLOAT},
        status: {type: Sequelize.ENUM('available','notInStock'),defaultValue:'available' }
	});

	return Product; 
}
