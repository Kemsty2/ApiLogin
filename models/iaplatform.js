const platformModel = (sequelize, Sequelize) => {
	const User = sequelize.define('IAPlatform', {
		platformName: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		token: {
			type: Sequelize.STRING,
			allowNull: false,
			unique:true
		},
		requestUI: {
			type: Sequelize.BOOLEAN,
		}
	});
	return User;
};

export default platformModel;
