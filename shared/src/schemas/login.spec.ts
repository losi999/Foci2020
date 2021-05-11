import { default as schema } from '@foci2020/shared/schemas/refresh-token';
import { validateSchemaAdditionalProperties, validateSchemaRequired, validateSchemaType } from '@foci2020/shared/common/unit-testing';
import { RefreshTokenRequest } from '@foci2020/shared/types/requests';
import { validatorService } from '@foci2020/shared/dependencies/services/validator-service';

describe('Refresh token schema', () => {
  let data: RefreshTokenRequest;

  beforeEach(() => {
    data = {
      refreshToken: 'some.refresh.token',
    };
  });

  it('should accept valid body', () => {
    const result = validatorService.validate(data, schema);
    expect(result).toBeUndefined();
  });

  describe('should deny', () => {
    describe('if data', () => {
      it('has additional property', () => {
        (data as any).extra = 'asd';
        const result = validatorService.validate(data, schema);
        validateSchemaAdditionalProperties(result, 'data');
      });
    });

    describe('if data.refreshToken', () => {
      it('is missing', () => {
        data.refreshToken = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'refreshToken');
      });

      it('is not string', () => {
        (data.refreshToken as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'refreshToken', 'string');
      });
    });
  });
});
