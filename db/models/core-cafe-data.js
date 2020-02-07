const Sequelize = require("sequelize");
const sequelize = new Sequelize("node_project", "root", "L730Mool", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

const CoreCafeData = sequelize.define("core_cafe_data", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  url_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true
  },
  content_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  metakeywords: {
    type: Sequelize.STRING,
    allowNull: false
  },
  metadescription: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = CoreCafeData;
