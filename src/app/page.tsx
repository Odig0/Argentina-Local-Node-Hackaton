'use client';
import Footer from 'src/components/Footer';
import TransactionWrapper from 'src/components/TransactionWrapper';
import WalletWrapper from 'src/components/WalletWrapper';
import { ONCHAINKIT_LINK } from 'src/links';
import OnchainkitSvg from 'src/svg/OnchainkitSvg';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';

import BlockchainWheelApp from '../components/BlockchainWheelApp';

export default function Page() {
  const { address } = useAccount();

  return (
    <div className="min-h-screen min-w-full w-full h-full bg-[#0a1733] flex flex-col">
      {/* Header y navegación original con logo */}
      <div className="flex flex-col px-1 md:w-[1008px] mx-auto w-full">
        <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
          <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="h-12 w-12 object-contain" />
              <span className="text-2xl font-bold text-white">Raffero</span>
            </div>
            <div className="flex items-center gap-3">
              <SignupButton />
              {/* LoginButton con color más azul */}
              {!address && (
                <div>
                  <LoginButton />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      {/* Nuevo body principal */}
      <div className="flex flex-col flex-1 w-full items-center justify-center">
        <BlockchainWheelApp />
      </div>
      <Footer />
    </div>
  );
}
