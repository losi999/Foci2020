import { default as schema } from '@/schemas/team';
import { validatorService } from '@/dependencies';
import { TeamRequest } from '@/types/types';
import { validateSchemaAdditionalProperties, validateSchemaRequired, validateSchemaType, validateSchemaMinLength, validateSchemaFormat, validateSchemaMaxLength } from '@/common/unit-testing';

describe('Team schema', () => {
  let data: TeamRequest;

  beforeEach(() => {
    data = {
      shortName: 'HUN',
      image: 'http://image.com/hun.jpg',
      teamName: 'Magyarország'
    };
  });

  describe('should accept', () => {
    it('valid body', () => {
      const result = validatorService.validate(data, schema);
      expect(result).toBeUndefined();
    });

    describe('if data.image', () => {
      it('is missing', () => {
        data.image = undefined;
        const result = validatorService.validate(data, schema);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('should deny', () => {
    describe('if data', () => {
      it('has additional property', () => {
        (data as any).extra = 'asd';
        const result = validatorService.validate(data, schema);
        validateSchemaAdditionalProperties(result, 'data');
      });
    });

    describe('if data.teamName', () => {
      it('is missing', () => {
        data.teamName = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'teamName');
      });

      it('is not string', () => {
        (data.teamName as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'teamName', 'string');
      });

      it('is too short', () => {
        data.teamName = '';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'teamName', 1);
      });
    });

    describe('if data.image', () => {
      it('is not string', () => {
        (data.image as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'image', 'string');
      });

      it('is not uri', () => {
        data.image = 'abcd';
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'image', 'uri');
      });
    });

    describe('if data.shortName', () => {
      it('is missing', () => {
        data.shortName = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'shortName');
      });

      it('is not string', () => {
        (data.shortName as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'shortName', 'string');
      });

      it('is too short', () => {
        data.shortName = 'ab';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'shortName', 3);
      });

      it('is too long', () => {
        data.shortName = 'abcd';
        const result = validatorService.validate(data, schema);
        validateSchemaMaxLength(result, 'shortName', 3);
      });
    });
  });
});
