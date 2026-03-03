import { notFound } from "next/navigation";

import { Icons } from "@workspace/ui-web/icons";

import { appConfig } from "~/config/app";
import { Footer } from "~/modules/marketing/layout/footer";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "~/modules/marketing/layout/section";
import { USE_CASES, getUseCaseBySlug } from "~/modules/marketing/use-cases/data";

import type { Metadata } from "next";

export function generateStaticParams() {
  return USE_CASES.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);
  if (!useCase) return {};

  const url = `${appConfig.url}/${useCase.slug}`;

  return {
    title: useCase.metaTitle,
    description: useCase.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: useCase.metaTitle,
      description: useCase.metaDescription,
      url,
      siteName: appConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: useCase.metaTitle,
      description: useCase.metaDescription,
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);

  if (!useCase) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: useCase.metaTitle,
    description: useCase.metaDescription,
    url: `${appConfig.url}/${useCase.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: appConfig.name,
      url: appConfig.url,
    },
    provider: {
      "@type": "Organization",
      name: appConfig.name,
      url: appConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="py-16 md:py-24">
        <SectionHeader className="max-w-3xl">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            {useCase.title}
          </span>
          <SectionTitle
            as="h1"
            className="text-3xl md:text-4xl lg:text-5xl"
          >
            {useCase.headline}
          </SectionTitle>
          <SectionDescription className="text-base md:text-lg">
            {useCase.description}
          </SectionDescription>
        </SectionHeader>
      </Section>

      <Section className="py-0 md:py-0 lg:py-0">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Beneficios
            </h2>
            <ul className="flex flex-col gap-3">
              {useCase.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Icons.Check className="text-primary mt-0.5 size-5 shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Exemplos de uso
            </h2>
            <ul className="flex flex-col gap-3">
              {useCase.examples.map((example) => (
                <li key={example} className="flex items-start gap-3">
                  <Icons.ArrowRight className="text-primary mt-0.5 size-5 shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    {example}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24">
        <div className="bg-primary/5 border-primary/20 flex w-full max-w-3xl flex-col items-center gap-6 rounded-2xl border p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Pronto para automatizar?
          </h2>
          <p className="text-muted-foreground max-w-lg text-sm md:text-base">
            Comece a usar o OpenClaw em 30 segundos. Sem configuração
            complicada, sem código, sem espera.
          </p>
          <a
            href="/dashboard"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            Começar agora
            <Icons.ArrowRight className="size-4" />
          </a>
          <p className="text-muted-foreground text-xs">
            A partir de R$49/mês. Cancele quando quiser.
          </p>
        </div>
      </Section>
    </>
  );
}
