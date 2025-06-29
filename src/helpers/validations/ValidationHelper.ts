import { Request } from 'express';
import Joi, { AnySchema, StringSchema, NumberSchema } from 'joi';
 
interface ValidationRule {
  [key: string]: string;
}
 
interface ValidationResult {
  status: boolean;
  message: string;
  errors?: { [key: string]: string };
}
 
export class ValidationHelper {
  static validateRequest(req: Request, rules: ValidationRule): ValidationResult | null {
    try {
      const schema: { [key: string]: AnySchema } = {};
 
      Object.keys(rules).forEach(field => {
        const ruleString = rules[field];
        const ruleArray = ruleString.split('|');
        let joiSchema: AnySchema;
       
        if (ruleArray.includes('string')) {
          joiSchema = Joi.string();
        } else if (ruleArray.includes('integer')) {
          joiSchema = Joi.number().integer();
        } else if (ruleArray.includes('boolean')) {
          joiSchema = Joi.boolean();
        } else if (ruleArray.includes('email')) {
          joiSchema = Joi.string().email();
        } else if (ruleArray.includes('array')) {
          joiSchema = Joi.array();
        } else if (ruleArray.includes('object')) {
          joiSchema = Joi.object();
        } else {
          joiSchema = Joi.string();
        }
        ruleArray.forEach(rule => {
          if (rule === 'required') {
            joiSchema = joiSchema.required();
          } else if (rule === 'string' || rule === 'integer' || rule === 'boolean' || rule === 'email' || rule === 'Array') {
            // no-op
          } else if (rule.startsWith('min:')) {
            const minValue = parseInt(rule.split(':')[1]);
            if (joiSchema.type === 'string') {
              joiSchema = (joiSchema as StringSchema).min(minValue);
            } else if (joiSchema.type === 'number') {
              joiSchema = (joiSchema as NumberSchema).min(minValue);
            }
          } else if (rule.startsWith('max:')) {
            const maxValue = parseInt(rule.split(':')[1]);
            if (joiSchema.type === 'string') {
              joiSchema = (joiSchema as StringSchema).max(maxValue);
            } else if (joiSchema.type === 'number') {
              joiSchema = (joiSchema as NumberSchema).max(maxValue);
            }
          } else if (rule.startsWith('in:')) {
            const values = rule.split(':')[1].split(',');
            joiSchema = joiSchema.valid(...values);
          }
        });
       
        schema[field] = joiSchema;
      });
     
      const joiSchema = Joi.object(schema).unknown(true);
     
      const { error } = joiSchema.validate(req.body, { abortEarly: false });
     
      if (error) {
        const errors: { [key: string]: string } = {};
        error.details.forEach(detail => {
          errors[detail.path[0]] = detail.message;
        });
       
        return {
          status: false,
          message: 'Validation failed',
          errors
        };
      }
     
      return null;
    } catch (error) {
      console.error('Validation error:', error);
      return {
        status: false,
        message: 'An error occurred during validation'
      };
    }
  }
}
 
export default ValidationHelper;