import { Schema, SchemaDefinition, SchemaDefinitionType, SchemaOptions } from 'mongoose';

export function makeSchema<T>(definition: SchemaDefinition<SchemaDefinitionType<T>>, option?: SchemaOptions) {
  const options = {
    autoIndex: true,
    autoCreate: true,
    id: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    ...option
  };
  return new Schema<T>(definition, options);
}
