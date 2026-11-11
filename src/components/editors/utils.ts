/* eslint-disable @typescript-eslint/no-explicit-any */

export function patchMonacoSchema(rawSchema: any): any {
  const patchedSchema = JSON.parse(JSON.stringify(rawSchema));

  if (!patchedSchema.$defs || typeof patchedSchema.$defs !== 'object') {
    return patchedSchema;
  }

  for (const defKey of Object.keys(patchedSchema.$defs)) {
    const targetDef = patchedSchema.$defs[defKey];

    if (!targetDef || !Array.isArray(targetDef.anyOf)) {
      continue;
    }

    // 1. Flatten the branches
    const flatBranches: any[] = targetDef.anyOf.reduce((acc: any[], currentBranch: any) => {
      if (currentBranch.oneOf && Array.isArray(currentBranch.oneOf)) {
        return [...acc, ...currentBranch.oneOf];
      }
      return [...acc, currentBranch];
    }, []);

    if (flatBranches.length === 0) continue;

    // 2. Get all potential discriminator keys from the FIRST branch
    // (A discriminator MUST have a "const" string value)
    const firstBranchProps = flatBranches[0]?.properties || {};
    let possibleDiscriminators = Object.keys(firstBranchProps).filter(
      (key) => firstBranchProps[key]?.const !== undefined && typeof firstBranchProps[key].const === 'string'
    );

    // 3. Intersect with all OTHER branches to find the common denominator
    for (let i = 1; i < flatBranches.length; i++) {
      const branchProps = flatBranches[i]?.properties || {};
      possibleDiscriminators = possibleDiscriminators.filter(
        (key) =>
          branchProps[key] !== undefined &&
          branchProps[key].const !== undefined &&
          typeof branchProps[key].const === 'string'
      );
    }

    // 4. If we don't have exactly ONE matching key, this isn't a simple
    // discriminated union. Skip it to be safe.
    if (possibleDiscriminators.length !== 1) {
      continue;
    }

    const detectedDiscriminator = possibleDiscriminators[0];

    // 5. Extract all unique values using the auto-detected key
    const allPossibleValues: string[] = flatBranches
      .map((branch: any) => branch?.properties?.[detectedDiscriminator]?.const)
      .filter((val: any): val is string => typeof val === 'string');

    if (allPossibleValues.length === 0) continue;

    // 6. Apply the Monaco allOf patch using the detected key
    patchedSchema.$defs[defKey] = {
      allOf: [
        {
          type: 'object',
          properties: {
            [detectedDiscriminator]: {
              type: 'string',
              enum: Array.from(new Set(allPossibleValues)),
            },
          },
        },
        {
          anyOf: flatBranches,
        },
      ],
    };
  }

  return patchedSchema;
}
