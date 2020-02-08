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

const IndexUrls = sequelize.define("index_urls", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  group_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  group_params: {
    type: Sequelize.STRING,
    allowNull: false
  },
  html_crc: {
    type: Sequelize.STRING,
    allowNull: false
  },
  clean_txt: {
    type: Sequelize.STRING,
    allowNull: true
  },
  add_dt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  actual_flag: {
    type: Sequelize.SMALLINT,
    allowNull: false
  },
  last_render_dt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  last_modification_dt: {
    type: Sequelize.DATE,
    allowNull: false
  },
});

module.exports = IndexUrls;
