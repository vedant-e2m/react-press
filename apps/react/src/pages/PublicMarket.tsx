import { BuilderRenderer, createPublicMarketDocument } from "@nextpress/builder";
import "@nextpress/builder/styles.css";

const publicMarketDocument = createPublicMarketDocument();

/** Live preview of The Public Market Emeryville homepage clone. */
export function PublicMarket() {
  return (
    <div className="public-market-preview">
      <BuilderRenderer document={publicMarketDocument} />
    </div>
  );
}
