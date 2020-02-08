const Sequelize = require("sequelize");
const sequelize = new Sequelize("node_project", "root", "L730Mool", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false,
    freezeTableName: true
  },
  logging: false
});

const PageContent = sequelize.define("page_content", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  content_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  content_order: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  block_type: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  block_content: {
    type: Sequelize.STRING,
    allowNull: true
  },
  cafe_block_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = PageContent;
