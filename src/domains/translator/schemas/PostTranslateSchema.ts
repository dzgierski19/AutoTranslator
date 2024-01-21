import z from "zod";

function validateRecursively(data: Record<string, any>): boolean {
  for (const key in data) {
    const newData = data[key];
    if (typeof newData === "string") {
      continue;
    }
    if (typeof newData === "object") {
      return validateRecursively(newData);
    }
    return false;
  }
  return true;
}

export const postTranslateSchema = z.object({
  text: z.union([z.string(), z.object({}).passthrough()]).refine((data) => {
    if (typeof data === "string") {
      return true;
    }
    return validateRecursively(data);
  }, "All nested properties must be strings or objects"),
  language: z.string().min(2).max(2),
});

const HarryKane = {
  pozycja: "napastnik",
  informacje: {
    narodowość: "12",
    statystyki: {
      ilość_bramek: "szesnaście",
      lepsza_noga: "prawa",
    },
  },
};
