function stripImportsExportsAndDirectives(sourceCode: string): string {
  return sourceCode
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith("import ") &&
        trimmed !== '"use client";' &&
        trimmed !== "'use client';" &&
        !trimmed.startsWith("export ")
      );
    })
    .join("\n")
    .trim();
}

/** Extract JSX inside return ( ... ), respecting nested parentheses. */
function extractReturnParenBody(code: string): string | null {
  const returnMatch = code.match(/\breturn\s*\(/);
  if (!returnMatch || returnMatch.index === undefined) return null;

  const openIndex = code.indexOf("(", returnMatch.index);
  if (openIndex === -1) return null;

  let depth = 0;
  for (let i = openIndex; i < code.length; i++) {
    const ch = code[i];
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth === 0) {
        return code.slice(openIndex + 1, i).trim();
      }
    }
  }

  return null;
}

function unwrapReturnWrapper(code: string): string {
  let result = code.trim();

  const fromReturn = extractReturnParenBody(result);
  if (fromReturn) return fromReturn;

  const returnJsxMatch = result.match(/^return\s+([\s\S]+?)\s*;?\s*\}?\s*$/);
  if (returnJsxMatch) {
    return returnJsxMatch[1].trim();
  }

  const parenOnlyMatch = result.match(/^\(\s*([\s\S]*)\s*\)\s*;?\s*\}?\s*$/);
  if (parenOnlyMatch && result.includes("<")) {
    return parenOnlyMatch[1].trim();
  }

  return result;
}

/** Turn shadcn doc pastes (return wrappers, demo functions) into a react-live JSX expression. */
export function normalizeJsxForLive(sourceCode: string): string {
  const trimmed = sourceCode.trim();
  if (!trimmed) return "";

  const fromOriginalReturn = extractReturnParenBody(trimmed);
  if (fromOriginalReturn) {
    return fromOriginalReturn.replace(/;\s*$/, "").trim();
  }

  let code = stripImportsExportsAndDirectives(trimmed);
  code = unwrapReturnWrapper(code);

  return code.replace(/;\s*$/, "").trim();
}
