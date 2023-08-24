const Joi = require('joi');

exports.branchesSchema = Joi.object({
    branchName: Joi.string().required(),
    region: Joi.string().required(),
    address: Joi.string().required(),
});
