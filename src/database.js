const Sequelize = require('sequelize');

// Connection information
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Creating the model
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

const Player = sequelize.define('player', {
	playerID: {
		type: Sequelize.INTEGER,
		unique: true,
	},
	name: {
		type: Sequelize.STRING,
		unique: false,
	},
	levelCap: {
		type: Sequelize.INTEGER,
		defaultValue: 100,
		unique:false,
	},
	hunger: {
		type: Sequelize.INTEGER,
		unique: false,
		defaultValue: 20,
	},
	fish: {
		type: Sequelize.INTEGER,
		unique: false,
		defaultValue: 1,
	}	
});

const Character = sequelize.define('character', {
	characterID: {
		type: Sequelize.INTEGER,
		unique: true,
	},
	
});

Character.hasOne(Player, {
	foreignKey: 'playerID'
});
Player.belongsTo(Character);


exports.sequelize = sequelize;
exports.Tags = Tags;
exports.Player = Player;
exports.Character = Character;