const userModel = (sequelize, Sequelize) => {
	const User = sequelize.define('iauser', {
		matricule: {
			primaryKey: true,
			type: Sequelize.STRING,
		},
		userName: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		userType: {
			type: Sequelize.INTEGER                     ,
			allowNull: false,
			validate: {
				isInt:true
			}
		}
	});
	return User;
};

export default userModel;