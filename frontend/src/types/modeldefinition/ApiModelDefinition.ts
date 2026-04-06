import { ModelDefinition } from "./ModelDefinitionFields";

export type ApiModelDefinition = {
  id: string;
  name: string;
  fields: ModelDefinition[];
};
