import underscore from "underscore"
import { xml2json } from "xml-js"
import { IDiffResultModel } from "../lib/model/diff-result-model"
import { IFieldOptions, ISchema } from "../lib/model/field-options-schema"
import { IOptionsModel } from "../lib/model/options-model"

const defaultOptions = {
  compareElementValues: true
}

const defaultXml2JsOptions = {
  compact: true,
  ignoreDoctype: true,
  ignoreDeclaration: true,
  ignoreAttributes: true
}

const compareObjects = (
  a: Object,
  b: Object,
  schema: ISchema,
  keyPrefix: string | null,
  options: IOptionsModel
): IDiffResultModel[] => {
  let differences: IDiffResultModel[] = []
  const ak: string[] = Object.keys(a)
  const bk: string[] = Object.keys(b)
  const allKeys: string[] = underscore.union(ak, bk)

  allKeys.forEach(key => {
    const formattedKey: string = (keyPrefix || "") + key
    const fieldOptions: IFieldOptions = schema[key] || {}

    if (!underscore.contains(ak, key)) {
      if (fieldOptions.skipKey) {
        return
      } else {
        const diffResult: IDiffResultModel = {
          path: formattedKey,
          resultType: "missing element",
          message: `field ${formattedKey} not present in lhs`
        }

        return differences.push(diffResult)
      }
    } else {
      //compare values
      if (fieldOptions.skipKey) {
        return
      } else {
        if (options.compareElementValues) {
          let valueA
          let valueB
          if ((<any>a)[key] !== undefined) {
            valueA = (<any>a)[key].toString()
          }
          if ((<any>b)[key] !== undefined) {
            valueB = (<any>b)[key].toString()
          }
          if (valueB !== undefined && valueA !== valueB && valueA !== "*") {
            const resultValueA = JSON.stringify((<any>a)[key], null, 1)
            const resultValueB = JSON.stringify((<any>b)[key], null, 1)
            const diffResult: IDiffResultModel = {
              path: formattedKey,
              resultType: "difference in element value",
              message: `field ${formattedKey} has lhs value ${resultValueA} and rhs value ${resultValueB}`,
              lhs: resultValueA,
              rhs: resultValueB
            }

            return differences.push(diffResult)
          }
        }
      }
    }

    if (!underscore.contains(bk, key)) {
      if (fieldOptions.skipKey) {
        return
      } else {
        const diffResult: IDiffResultModel = {
          path: formattedKey,
          resultType: "missing element",
          message: `field ${formattedKey} not present in rhs`
        }

        return differences.push(diffResult)
      }
    }

    if (underscore.isArray((<any>a)[key])) {
      for (let i = 0; i < (<any>a)[key].length; i++) {
        const objA = (<any>a)[key][i]
        const objB = (<any>b)[key][i]

        if (objA === "" && objB === "") {
          return
        }
        if (objA === "false" && objB === "false") {
          return
        }
        if (objA === 0 && objB === 0) {
          return
        }
        if (!objB) {
          const diffResult: IDiffResultModel = {
            path: formattedKey,
            resultType: "missing element",
            message: `field ${formattedKey}[${i}] not present in rhs`
          }

          return differences.push(diffResult)
        }
        if (!objA) {
          const diffResult: IDiffResultModel = {
            path: formattedKey,
            resultType: "missing element",
            message: `element ${formattedKey}[${i}] not present in lhs`
          }

          return differences.push(diffResult)
        }
        if (
          underscore.isObject((<any>a)[key][i]) &&
          underscore.isObject((<any>b)[key][i])
        ) {
          differences = differences.concat(
            compareObjects(
              (<any>a)[key][i],
              (<any>b)[key][i],
              schema,
              `${formattedKey}[${i}].`,
              options
            )
          )
        }
      }
    } else if (underscore.isObject((<any>a)[key])) {
      differences = differences.concat(
        compareObjects(
          (<any>a)[key],
          (<any>b)[key],
          schema,
          `${formattedKey}.`,
          options
        )
      )
    }
  })

  return differences
}

/**
 * Remove all _text keys from xml2json result to be able to reuse compare object function
 * Works whether nativeType option = true or false
 * If ignoreAttributes option = false, then the _text key will remain for those elements that have attributes,
 * which appear in the results JSON like
 * `{ "someField": { "_attributes": { "foo": "bar" }, "_text": "baz" } }`
 */
function adjustXMLforDiff(input: string): string {
  return input.replace(/({"_text":)("?(.*?)"?)(})/g, `$2`)
}

export function diff(
  lhs: Object,
  rhs: Object,
  schema: ISchema | undefined,
  options: IOptionsModel | undefined,
  next: any
) {
  next(
    compareObjects(
      lhs,
      rhs,
      schema || {},
      null,
      underscore.extend({}, defaultOptions, options)
    )
  )
}

export function diffAsXml(
  lhs: string,
  rhs: string,
  schema: ISchema | undefined,
  options: IOptionsModel | undefined,
  next: any
) {
  const xml2JsOpts = underscore.extend({}, defaultXml2JsOptions)
  if (options && options.xml2jsOptions) {
    underscore.extend(xml2JsOpts, options.xml2jsOptions)
  }

  const lhsp = xml2json(lhs, xml2JsOpts)
  const rhsp = xml2json(rhs, xml2JsOpts)
  const lhsCompareString = adjustXMLforDiff(lhsp)
  const rhsCompareString = adjustXMLforDiff(rhsp)
  const jsonLhs = JSON.parse(lhsCompareString)
  const jsonRhs = JSON.parse(rhsCompareString)
  next(
    compareObjects(
      jsonLhs,
      jsonRhs,
      schema || {},
      null,
      underscore.extend({}, defaultOptions, options)
    )
  )
}
