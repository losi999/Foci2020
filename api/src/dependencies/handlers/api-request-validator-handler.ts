import { default as apiRequestValidatorHandler } from '@foci2020/api/handlers/api-request-validator-handler';
import { validatorService } from '@foci2020/shared/dependencies/services/validator-service';

export const apiRequestValidator = apiRequestValidatorHandler(validatorService);
