export interface IFieldOptions {
  [index: number]: number
  skipKey: boolean
}

export interface ISchema {
  [a: string]: IFieldOptions
}
