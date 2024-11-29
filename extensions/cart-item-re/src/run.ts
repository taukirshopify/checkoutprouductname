import type {
  RunInput,
  FunctionRunResult,
  CartOperation,
  ProductVariant
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  // Filter the cart lines that have merchandise of type "ProductVariant" and include a ":" in the title


  const operations: CartOperation[] = input.cart.lines.filter(
    line => line.merchandise.__typename === "ProductVariant" && line.merchandise.product.title.includes(":")
  ).map(line => {
    // Safely cast line.merchandise to ProductVariant
    const productVarianttwo = line.merchandise as ProductVariant;
    console.log("working");
    console.log("Line data:", JSON.stringify(line, null, 2));

    return {
      update: {
        cartLineId: line.id,
        title: productVarianttwo.product.title.split(":")[0],  // Update title to everything before the ":"
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: 16000
            }
          }
        }
      }
    };
  });

  // If operations were created, return them; otherwise, return NO_CHANGES
  return operations.length > 0 ? { operations } : NO_CHANGES;
}
