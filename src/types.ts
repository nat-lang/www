import { HierarchyNode } from "d3-hierarchy";

export type toEnumType<EnumType> = EnumType[keyof EnumType]

export type UUID = string;

export type Author = {
  id: UUID
  full_name: string
}

export type TreeID = string;

export type SyntaxTree = {
  id: TreeID
  label: string
  children?: SyntaxTree[]
}

export type SemanticTree = {
  id: TreeID
  expr: string
  type: string
  typeError: string
  value: string
  valuationError: string
  syntaxLabel: string
  children?: [SemanticTree]
}

export type CoordinatedSyntaxTree = HierarchyNode<SyntaxTree>
export type CoordinatedSemanticTree = HierarchyNode<SemanticTree>

export type ExampleBase = {
  module_id: UUID
  description: string
  content: string
  label: string
}

export type Example = ExampleBase & { id: UUID }
export type TemporaryExample = ExampleBase & {
  temp_id: UUID
}

export type ExampleEditValues = Pick<ExampleBase, 'label' | 'content'>
export type ExampleCreateValues = ExampleBase

export type InterpretationBase = {
  example_id: UUID
  content: string
  paraphrase: string
}

export type Interpretation = InterpretationBase & {
  id: UUID
  constituency_parse?: ConstituencyParse
}

export type TemporaryInterpretation = InterpretationBase & {
  temp_id: UUID
}

export type InterpretationEditValues = Pick<InterpretationBase, 'content'>
export type InterpretationCreateValues = InterpretationBase

export type ConstituencyParse = {
  id: UUID
  interpretation_id: UUID
  parse_string: string
  syntax_tree: SyntaxTree
}

export type ConstituencyParseNodeEditValues = {
  id: TreeID
  label: string
}

export type ConstituencyParseEditValues = {
  parse_string: string
}

export type CoordinatedConstituencyParse = ConstituencyParse & {
  coordinated_syntax_tree: CoordinatedSyntaxTree
}

export type Module = {
  id: UUID
  slug: string
  author?: Author
  title: string
  content: string
}

export type IndexRouteParams = {
  foo: string
}

export type ModuleUpdateRouteParams = {
  slug: string
}

export type ModuleCreateRouteParams = {}

export type ModuleCreateValues = Omit<Module, "slug">;
export type ModuleUpdateValues = Pick<Module, "title" | "content">

export type DocReadRouteParams = {
  slug: string
}