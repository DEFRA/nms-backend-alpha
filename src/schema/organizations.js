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

const organizationsSchema = (entity) => {
  return Joi.object({
    orgName: Joi.string().label('Organization Name').required(),
    orgType: Joi.string().label('Type of Organization').required(),
    typeOfDeveloper: Joi.string()
      .label('Type of Developer')
      .when('orgType', {
        is: Joi.exist().valid('930750007'),
        then: Joi.required(),
        otherwise: Joi.allow('').optional()
      }),
    mitigationProviderSBI: Joi.string()
      .label('Mitigation Provide SBI')
      .max(9)
      .default('')
      .allow('')
      .optional(),
    crn: Joi.string()
      .label('Company Registration Number')
      .max(8)
      .default('')
      .allow('')
      .optional(),
    nationality: Joi.string()
      .label('Nationality')
      .when('typeOfDeveloper', {
        is: Joi.exist().valid('930750001'),
        then: Joi.required(),
        otherwise: Joi.allow('').optional()
      }),
    address1: Joi.string()
      .label('Address 1')
      .max(100)
      .when('orgType', {
        is: Joi.exist().valid('930750003', '930750001'),
        then: Joi.string().required(),
        otherwise: Joi.string().optional().allow('')
      }),
    address2: Joi.string()
      .label('Address 2')
      .max(100)
      .default('')
      .allow('')
      .optional(),
    address3: Joi.string()
      .label('Address 3')
      .max(100)
      .default('')
      .allow('')
      .optional(),
    townRCity: Joi.string()
      .label('Town/City')
      .max(100)
      .when('orgType', {
        is: Joi.exist().valid('930750003', '930750001'),
        then: Joi.required(),
        otherwise: Joi.string().allow('').optional()
      }),
    postcode: Joi.string()
      .label('Postal Code')
      .max(100)
      .when('orgType', {
        is: Joi.exist().valid('930750003', '930750001'),
        then: Joi.required(),
        otherwise: Joi.string().allow('').optional()
      }),
    regAddress1: Joi.string()
      .label('Address 1')
      .max(100)
      .when('typeOfDeveloper', {
        is: Joi.exist().valid('930750000', '930750001', '930750002'),
        then: Joi.required(),
        otherwise: Joi.allow('').optional()
      }),
    regAddress2: Joi.string()
      .label('Address 2')
      .max(100)
      .default('')
      .allow('')
      .optional(),
    regAddress3: Joi.string()
      .label('Address 3')
      .max(100)
      .default('')
      .allow('')
      .optional(),
    regTownRCity: Joi.string()
      .label('Town/City')
      .max(100)
      .when('typeOfDeveloper', {
        is: Joi.exist().valid('930750000', '930750001', '930750002'),
        then: Joi.required(),
        otherwise: Joi.allow('').optional()
      }),
    regPostcode: Joi.string()
      .label('Postal Code')
      .max(100)
      .when('typeOfDeveloper', {
        is: Joi.exist().valid('930750000', '930750001', '930750002'),
        then: Joi.required(),
        otherwise: Joi.allow('').optional()
      }),
    status: Joi.string().required(),
    entity: Joi.string().required(),
    ...(entity === 'contact' && {
      contacts: Joi.array().items(contactSchema).required()
    })
  })
}

export default organizationsSchema
