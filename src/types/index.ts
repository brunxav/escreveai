export type TextType = "email" | "linkedin" | "product" | "bio";

export interface FieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

export interface TextTypeConfig {
  id: TextType;
  label: string;
  icon: string;
  fields: FieldConfig[];
}

export interface GeneratedText {
  id: string;
  type: TextType;
  inputs: Record<string, string>;
  result: string;
  createdAt: Date;
}
