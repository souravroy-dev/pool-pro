'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Waves, Star, Users, Clock, Shield, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-xl text-slate-900">PoolPro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-sm text-blue-300 mb-6">
              <Waves size={14} />
              <span>The #1 pool cleaning marketplace</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Get your pool
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"> cleaned today</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl">
              Post a job. Get competitive bids from vetted local cleaners. Done — it&apos;s that simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 text-base"
              >
                Post a Job
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:bg-white/5 hover:text-white transition-all text-base"
              >
                I&apos;m a Cleaner
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-slate-400 font-medium">4.9 avg rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} />
                <span>2,400+ cleaners</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Instant bids</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Whether you need your pool cleaned or you&apos;re a professional cleaner
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Customers */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">🏊</span>
                For Pool Owners
              </h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Post a Job', desc: 'Tell us about your pool, set your date, and pick your location on the map.' },
                  { step: 2, title: 'Get Bids', desc: 'Nearby cleaners will send you competitive quotes within hours.' },
                  { step: 3, title: 'Pick & Relax', desc: 'Choose the best cleaner, sit back, and enjoy your sparkling clean pool.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Cleaners */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-600 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-600">🧹</span>
                For Cleaners
              </h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Set Your Area', desc: 'Tell us where you service and how far you\'re willing to travel.' },
                  { step: 2, title: 'Find Jobs', desc: 'Browse nearby jobs that match your service area and expertise.' },
                  { step: 3, title: 'Bid & Earn', desc: 'Send your best price, get hired, and get paid for every clean.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-600 shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Vetted Professionals', desc: 'All cleaners have proven experience and verified profiles with ratings.' },
              { icon: Clock, title: 'Fast Responses', desc: 'Get bids within hours, not days. Most jobs get 3+ bids in the first 24h.' },
              { icon: Star, title: 'Quality Guaranteed', desc: 'Rate your experience. High ratings drive our community forward.' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 hover:shadow-card-hover transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of pool owners and cleaners using PoolPro every day.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg text-base"
          >
            Post Your First Job
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <span className="font-bold text-white">PoolPro</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 PoolPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
