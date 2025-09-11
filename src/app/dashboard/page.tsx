'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type ModuleCardProps = { name: string; redirect: string }

const modules: ModuleCardProps[] = [
  { name: 'Informações de Pedidos', redirect: '#' },
  { name: 'Consultar Laudo(s) Técnico(s)', redirect: '#' },
  { name: 'Novidades, Avisos e Comunidade', redirect: '#' },
  { name: 'Dados da Sua Conta', redirect: '#' },
]

function ModuleCard({ name, redirect }: ModuleCardProps) {
  return (
    <Link
      href={redirect}
      className="block w-full rounded-lg bg-[#527BC6] px-4 py-2 text-left text-white text-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#527BC6]/50"
    >
      {name}
    </Link>
  )
}

function ModuleList() {
  return (
    <div className="grid w-full gap-2">
      {modules.map((m) => (
        <ModuleCard key={m.name} {...m} />
      ))}
    </div>
  )
}

export default function Modules() {
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile header (hidden on md+) */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/pharmedice-logo.svg"
            alt="Logo da Pharmédice"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-sm font-bold text-[#527BC6]">Área do Cliente</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-modules"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </header>

      {/* Mobile dropdown menu (collapsible) */}
      <div
        id="mobile-modules"
        className={`md:hidden bg-white px-4 transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-96 py-3 border-b' : 'max-h-0'
        }`}
      >
        <ModuleList />
      </div>

      {/* Desktop sidebar (no border/shadow) */}
      <nav className="hidden md:flex md:w-[20%] md:min-w-[240px] md:max-w-[320px] bg-white p-6 flex-col items-center shadow-none">
        <Image
          src="/icons/pharmedice-logo.svg"
          alt="Logo da Pharmédice"
          width={100}
          height={100}
          className="mt-2 mb-2"
        />
        <h1 className="mb-4 text-center text-base font-bold text-[#527BC6]">
          Área do Cliente
        </h1>
        <ModuleList />
      </nav>

      {/* Main content */}
      <section className="flex-1 bg-gray-50">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-6 md:h-full">
          <h2 className="mb-3 text-center text-xl font-bold text-[#527BC6] md:text-2xl">
            <span className="font-light">Bem-vindo à</span> Área do Cliente
          </h2>
          <p className="text-center text-gray-700 text-sm md:text-base">
            Aqui você pode acessar informações sobre seus pedidos, consultar laudos técnicos,
            ficar por dentro das novidades e gerenciar os dados da sua conta.
          </p>

          {/* Quick access grid on mobile */}
          <div className="mt-6 w-full md:hidden">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">Acessos rápidos</h3>
            <ModuleList />
          </div>
        </div>
      </section>
    </main>
  )
}