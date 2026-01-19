import { VariationOption } from "../types/catalog";

export const groupOptions = (variations: VariationOption[], byId = false) => {
  const groupedOptionsRecord: Record<string, VariationOption[]> =
    variations.reduce(
      (acc, option) => {
        const kindKey = byId ? option.kind.id : option.kind.name;

        if (!acc[kindKey]) {
          acc[kindKey] = [];
        }

        acc[kindKey].push(option);
        return acc;
      },
      {} as Record<string, VariationOption[]>,
    );

  return Object.entries(groupedOptionsRecord);
};
