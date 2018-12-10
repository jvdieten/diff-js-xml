export interface IDiffResultModel {
  path: string
  resultType: "missing element" | "difference in element value"
  message: string
}
