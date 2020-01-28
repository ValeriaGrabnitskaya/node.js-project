const Sequelize = require("sequelize");
const sequelize = new Sequelize("node_project", "root", "Hrab-123", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

const Session = sequelize.define("sessions", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_session_date: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Session;
