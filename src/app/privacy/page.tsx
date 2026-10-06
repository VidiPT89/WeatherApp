import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — AmazingWeatherApp",
  description: "Que dados a AmazingWeatherApp recolhe, para quê, e como apagar a tua conta.",
};

const CONTACT_EMAIL = "ividi.dev@gmail.com";
const LAST_UPDATED = "6 de outubro de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <div className="space-y-2 text-text-muted">{children}</div>
    </section>
  );
}

/**
 * Public privacy policy linked from the iOS app's Settings and from App Store Connect. Lives on
 * the web client because it's the app's own public domain; listed in the proxy's public paths.
 */
export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-12 leading-relaxed">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-text">Política de Privacidade</h1>
        <p className="text-sm text-text-subtle">AmazingWeatherApp · Última atualização: {LAST_UPDATED}</p>
      </header>

      <Section title="Quem somos">
        <p>
          A AmazingWeatherApp (iOS, Android e web) é desenvolvida por David Arsénio Martins (iVidi.dev). Para qualquer
          questão sobre privacidade, escreve para <a className="text-accent underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>

      <Section title="Usar sem conta">
        <p>
          Podes consultar o tempo sem criar conta. Nesse caso não guardamos nada associado a ti: a cidade pesquisada ou
          as coordenadas são usadas apenas para obter a previsão e não ficam ligadas a nenhuma pessoa.
        </p>
      </Section>

      <Section title="Dados que recolhemos com conta">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Email</strong> e, se criares conta com password, a password guardada de forma cifrada (hash).</li>
          <li><strong>Identificador do login social</strong> (Apple, Google ou Microsoft), se usares essa opção.</li>
          <li><strong>Cidades favoritas</strong> e <strong>histórico de pesquisas</strong>, para os mostrar entre dispositivos.</li>
          <li><strong>Preferência de unidades</strong> (°C ou °F).</li>
        </ul>
      </Section>

      <Section title="Localização">
        <p>
          Se deres permissão, a app usa a tua localização apenas enquanto está aberta, para mostrar o tempo onde estás.
          As coordenadas são enviadas ao nosso servidor para encontrar a cidade e obter a previsão, e não são guardadas.
          Se tiveres sessão iniciada, o nome dessa cidade fica no teu histórico de pesquisas, que podes limpar quando
          quiseres.
        </p>
      </Section>

      <Section title="Com quem partilhamos">
        <p>
          Não vendemos dados nem usamos publicidade ou rastreio. Para obter a previsão, o nosso servidor consulta
          fornecedores de meteorologia (OpenWeatherMap e Open-Meteo), enviando apenas a cidade ou as coordenadas, nunca
          o teu email. Os dados da conta ficam numa base de dados alojada pelos nossos fornecedores de infraestrutura
          (Render e Neon).
        </p>
      </Section>

      <Section title="Apagar a conta">
        <p>
          Podes apagar a tua conta a qualquer momento na app, em <strong>Definições → Apagar conta</strong>. Isso
          elimina de imediato o email, os favoritos, o histórico e as sessões ativas. Também podes pedir a eliminação
          por email.
        </p>
      </Section>

      <Section title="Os teus direitos">
        <p>
          Ao abrigo do RGPD, podes pedir acesso, correção ou eliminação dos teus dados através do email acima. Se
          entenderes que os teus direitos não foram respeitados, podes apresentar queixa à CNPD.
        </p>
      </Section>

      <hr className="border-border" />

      <section lang="en" className="space-y-2 text-sm text-text-muted">
        <h2 className="text-base font-semibold text-text">English summary</h2>
        <p>
          You can check the weather without an account; nothing is stored about you in that case. With an account we
          store your email (and a hashed password, or your Apple/Google/Microsoft sign-in identifier), favourite cities,
          search history and unit preference. Location is only used while the app is open to show local weather; the
          coordinates are not saved (when signed in, the resulting city name is added to your search history). We don&apos;t sell data, show ads or track you. Weather lookups send only a city or coordinates to
          OpenWeatherMap and Open-Meteo. You can delete your account at any time in Settings → Delete account, which
          removes all of your data immediately. Contact: {CONTACT_EMAIL}.
        </p>
      </section>
    </main>
  );
}
