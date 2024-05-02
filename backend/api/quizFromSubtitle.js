const user_controller = require('../userManage/user_controller');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  await user_controller.getQuizFromSubtitles(req, res);
};
