
import './globals.css';
import { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import ClientShell from '@/components/core/ClientShell';
import HeaderIndustrial from '@/components/core/HeaderIndustrial';
import FooterIndustrial from '@/components/core/FooterIndustrial';
import { PROJECT_IDENTITY } from '@/lib/metadata';

const fontHeading = Montserrat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-heading-selected' });
const fontBody = Open_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-body-selected' });
export const metadata: Metadata = { title: PROJECT_IDENTITY.brandName, description: PROJECT_IDENTITY.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable} h-full`}>
      <body className="h-full overflow-hidden bg-background text-foreground">
        <ClientShell>
          <HeaderIndustrial logo={PROJECT_IDENTITY.brandName} branding={PROJECT_IDENTITY.branding} links={PROJECT_IDENTITY.navigation.links} cta={PROJECT_IDENTITY.navigation.primaryCta} />
          <main className="min-h-screen">{children}</main>
          <FooterIndustrial logo={PROJECT_IDENTITY.brandName} branding={PROJECT_IDENTITY.branding} copyright={`© ${new Date().getFullYear()} ${PROJECT_IDENTITY.brandName}. All rights reserved.`} />
        </ClientShell>
      </body>
    </html>
  );
}
