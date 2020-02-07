const Sequelize = require("sequelize");
const sequelize = new Sequelize("node_project", "root", "L730Mool", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

const IndexUrlsWords = sequelize.define("index_urls_words", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  index_url: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  clean_txt_index: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  word: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = IndexUrlsWords;
