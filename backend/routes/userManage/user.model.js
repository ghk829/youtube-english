import sequelize from "./db";


const User = sequelize.define('User', {
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  videosWatched: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, 
  },
  cumulativeDaysAccessed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, 
  },
}, {
  timestamps: true, 
});


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = User;
