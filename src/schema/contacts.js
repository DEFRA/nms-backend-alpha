import Joi from 'joi'

const contactSchema = Joi.object({
  firstName: Joi.string().label('First Name').max(50).required(),
  lastName: Joi.string().label('Last Name').max(50).required(),
  email: Joi.string()
    .label('E-Mail ID')
    .max(100)
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .label('Telephone')
    .pattern(/^\d{1,11}$/)
    .required(),
  cid: Joi.string().label('Contact ID').required()
})

const contactsSchema = Joi.object({
  contacts: Joi.array().items(contactSchema).required(),
  status: Joi.string().required(),
  entity: Joi.string().required()
})

export default contactsSchema
