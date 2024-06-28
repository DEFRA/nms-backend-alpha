import Joi from 'joi'

const developmentSite = Joi.object({
  developmentSiteId: Joi.string().max(50).required(),
  catchment: Joi.string().max(50).required(),
  certificateExtensionRequired: Joi.string()
    .valid('Yes', 'No')
    .default('')
    .allow('')
    .required(),
  creditSalesStatus: Joi.string()
    .valid(
      'Application received',
      'Prioritisation',
      'Cannot service',
      'CDD check',
      'Unsigned certificate sent',
      "Signed developer's declaration received",
      'First stage payment',
      'Planning application decision received',
      'Second stage payment',
      'Final certificate sent',
      'Developer withdrawn',
      'NE withdrawn'
    )
    .default('')
    .allow('')
    .required(),
  customerDueDiligenceCheckNeeded: Joi.string()
    .valid('Yes', 'No')
    .default('')
    .allow('')
    .required(),
  developerCompany: Joi.string().max(50).required(),
  gridReference: Joi.string().max(14).required(),
  lpas: Joi.string().max(50).required(),
  numberOfUnitsToBeBuilt: Joi.string().max(50).required(),
  ownerId: Joi.string().max(50).required(),
  phasedDevelopment: Joi.string()
    .valid('Yes', 'No')
    .default('')
    .allow('')
    .required(),
  planningPermission: Joi.string()
    .valid('Yes', 'No')
    .default('')
    .allow('')
    .required(),
  siteName: Joi.string().max(50).required(),
  smeDeveloper: Joi.string()
    .valid('Yes', 'No')
    .default('')
    .allow('')
    .required(),
  stateCode: Joi.string().max(50).required(),
  subCatchments: Joi.string().max(50).required(),
  theDeveloperIsTheApplicant: Joi.string()
    .valid(
      'Yes',
      'NA - Information not provided by the applicant',
      'NA - No historical data',
      'Other'
    )
    .default('')
    .allow('')
    .required(),
  theDevelopersInterestInTheDevelopmentSite: Joi.string()
    .valid(
      'Freehold',
      'NA - Information not provided by the applicant',
      'NA - No historical data',
      'Other'
    )
    .default('')
    .allow('')
    .required(),
  haveYouIncludedTheProposedRedLineB: Joi.string()
    .valid('Yes', 'No')
    .default('')
    .allow('')
    .required()
})

export default developmentSite
