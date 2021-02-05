import { cloudFormation } from '@foci2020/shared/dependencies/aws/cloudformation';
import { lambda } from '@foci2020/shared/dependencies/aws/lambda';
import { infrastructureServiceFactory } from '@foci2020/shared/services/infrastructure-service';

export const infrastructureService = infrastructureServiceFactory(cloudFormation, lambda);
