import Joi from 'joi'

const contactSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  address: Joi.string().optional().empty().allow('').default('')
})

export default contactSchema
