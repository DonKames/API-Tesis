const Joi = require('joi');

exports.globalSettingsSchema = Joi.object({
    branchName: Joi.string().required(),
});
