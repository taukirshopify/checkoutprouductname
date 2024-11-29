import type {
  RunInput,
  FunctionRunResult,
  CartOperation,
  ProductVariant,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  console.log("Starting the 'run' function...");

  console.log("Input data received:", JSON.stringify(input));

  const operations: CartOperation[] = input.cart.lines
    .filter((line) => {
      const isProductVariant =
        line.merchandise.__typename === "ProductVariant";
      const hasColonInTitle = line.merchandise.product.title.includes(":");

      console.log(
        `Processing line ID: ${line.id}, isProductVariant: ${isProductVariant}, hasColonInTitle: ${hasColonInTitle}`
      );

      return isProductVariant && hasColonInTitle;
    })
    .map((line) => {
      const productVariant = line.merchandise as ProductVariant;
      const updatedTitle = productVariant.product.title
        .split(":")[0]
        .trim();

      console.log(
        `Updating line ID: ${line.id}, original title: "${productVariant.product.title}", updated title: "${updatedTitle}"`
      );

      return {
        type: "update",
        cartLineId: line.id,
        updates: {
          lineItems: [
            {
              id: line.id,
              merchandise: {
                product: {
                  title: updatedTitle,
                },
              },
            },
          ],
        },
      };
    });

  if (operations.length > 0) {
    console.log("Generated operations:", JSON.stringify(operations, null, 2));
  } else {
    console.log("No operations to perform. Returning NO_CHANGES.");
  }

  return operations.length > 0 ? { operations } : NO_CHANGES;
}
