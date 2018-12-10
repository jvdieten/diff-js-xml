import underscore from "underscore"
import { xml2json } from "xml-js"

const compareObjects = (
  a: Object,
  b: Object,
  schema: Object | null,
  keyPrefix: string | null,
  options: Object[] | null
): Object[] => {
  let differences: Object[] = []
  const ak: string[] = Object.keys(a)
  const bk: string[] = Object.keys(b)
  const allKeys = underscore.union(ak, bk)

  allKeys.forEach(key => {
    const formattedKey: string = (keyPrefix || "") + key
    const fieldOptions = (<any>schema)[key] || {}

    if (options !== null) {
      if (options.filter && options.filter((<any>a)[key], (<any>b)[key])) {
        return
      }
    }

    if (!underscore.contains(ak, key)) {
      if (fieldOptions.skipKey) {
        return
      } else {
        return differences.push({
          path: formattedKey,
          type: "missing field",
          message: `field ${formattedKey} not present in lhs`
        })
      }
    } else {
      //compare values
      const valueA: string = (<any>a)[key].toString()
      const valueB: string = (<any>b)[key].toString()
      if (valueB !== undefined && valueA !== valueB && valueA !== "*") {
        return differences.push({
          path: formattedKey,
          type: "difference in field value",
          message: `field ${formattedKey} has lhs value ${valueA} and rhs value ${valueB}`
        })
      }
    }

    if (!underscore.contains(bk, key)) {
      if (fieldOptions.skipKey) {
        return
      } else {
        return differences.push({
          path: formattedKey,
          type: "missing field",
          message: `field ${formattedKey} not present in rhs`
        })
      }
    }

    if (
      (fieldOptions.compareTypes === undefined ||
        fieldOptions.compareTypes === true) &&
      typeof (<any>a)[key] !== typeof (<any>b)[key]
    ) {
      return differences.push({
        path: formattedKey,
        type: "type equality",
        message: `lhs field type (${typeof (<any>a)[
          key
        ]}) does not match rhs field type (${typeof (<any>b)[key]})`,
        lhs: (<any>a)[key],
        rhs: (<any>b)[key]
      })
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
          return differences.push({
            path: formattedKey,
            type: "missing field",
            message: `field ${formattedKey}[${i}] not present in rhs`
          })
        }
        if (!objA) {
          return differences.push({
            path: formattedKey,
            type: "missing field",
            message: `field ${formattedKey}[${i}] not present in lhs`
          })
        }
        if (
          underscore.isObject((<any>a)[key][i]) &&
          underscore.isObject((<any>b)[key][i])
        ) {
          differences = differences.concat(
            compareObjects(
              (<any>a)[key][i],
              (<any>b)[key][i],
              fieldOptions,
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
          fieldOptions,
          `${formattedKey}.`,
          options
        )
      )
    }
  })

  return differences
}

function adjustXMLforDiff(input: string): string {
  return input.replace(/({"_(.*?)":)("(.*?)")(})/g, `$3`)
}

export function diff(
  lhs: Object,
  rhs: Object,
  schema: Object | null,
  options: Object[] | null,
  next: any
) {
  next(compareObjects(lhs, rhs, schema || {}, null, options))
}

export function diffAsXml(
  lhs: string,
  rhs: string,
  schema: Object | null,
  options: Object[] | null,
  next: any
) {
  const lhsp = xml2json(lhs, {
    compact: true,
    ignoreDoctype: true,
    ignoreAttributes: true
  })
  const rhsp = xml2json(rhs, {
    compact: true,
    ignoreDoctype: true,
    ignoreAttributes: true
  })
  const lhsCompareString = adjustXMLforDiff(lhsp)
  const rhsCompareString = adjustXMLforDiff(rhsp)
  const jsonLhs = JSON.parse(lhsCompareString)
  const jsonRhs = JSON.parse(rhsCompareString)
  next(compareObjects(jsonLhs, jsonRhs, schema || {}, null, options))
}
