
import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientShell from '@/components/core/ClientShell';
import HeaderIndustrial from '@/components/core/HeaderIndustrial';
import FooterIndustrial from '@/components/core/FooterIndustrial';
import { PROJECT_IDENTITY } from '@/lib/metadata';

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' });
export const metadata: Metadata = { title: PROJECT_IDENTITY.brandName, description: PROJECT_IDENTITY.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} font-sans h-full`}>
      <body className="h-full overflow-hidden bg-background text-foreground">
        <ClientShell>
          <HeaderIndustrial logo={PROJECT_IDENTITY.brandName} branding={PROJECT_IDENTITY.branding} links={PROJECT_IDENTITY.header.links} cta={PROJECT_IDENTITY.header.cta} />
          <main className="min-h-screen">{children}</main>
          <FooterIndustrial 
            logo={PROJECT_IDENTITY.brandName} 
            branding={PROJECT_IDENTITY.branding}
            tagline={PROJECT_IDENTITY.footer.tagline}
            links={PROJECT_IDENTITY.footer.links}
            socialLinks={PROJECT_IDENTITY.footer.socialLinks}
            policyLinks={PROJECT_IDENTITY.footer.policyLinks}
            copyright={`© ${new Date().getFullYear()} ${PROJECT_IDENTITY.brandName}. All rights reserved.`} 
          />
        </ClientShell>
      </body>
    </html>
  );
}
