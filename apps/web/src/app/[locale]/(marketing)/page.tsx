import { withI18n } from "@workspace/i18n/with-i18n";

import { appConfig } from "~/config/app";
import { getSession } from "~/lib/auth/server";
import { getMetadata } from "~/lib/metadata";
import { Comparison } from "~/modules/marketing/home/comparison";
import { Hero } from "~/modules/marketing/home/hero";
import { UseCases } from "~/modules/marketing/home/use-cases";

export const generateMetadata = getMetadata({
  title: "common:product.title",
  description: "common:product.description",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: appConfig.name,
  url: appConfig.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "41.65",
    highPrice: "49.00",
    offerCount: 3,
    offers: [
      {
        "@type": "Offer",
        name: "Plano Mensal",
        price: "49.00",
        priceCurrency: "BRL",
        billingDuration: "P1M",
      },
      {
        "@type": "Offer",
        name: "Plano Trimestral",
        price: "139.00",
        priceCurrency: "BRL",
        billingDuration: "P3M",
      },
      {
        "@type": "Offer",
        name: "Plano Semestral",
        price: "249.90",
        priceCurrency: "BRL",
        billingDuration: "P6M",
      },
    ],
  },
  description:
    "Implante seu agente de IA no Telegram em 30 segundos. Automatize atendimento, vendas e suporte 24/7.",
};

const HomePage = async () => {
  const { user } = await getSession();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero user={user} />
      <Comparison />
      <UseCases />
    </>
  );
};

export default withI18n(HomePage);
