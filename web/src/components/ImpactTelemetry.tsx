"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Globe2, Sparkles, CheckCircle2 } from "lucide-react";

const STATS = [
  {
    number: "42+",
    label: "Released AI Models & Agents",
    subtext: "Live specifications & architectures",
    icon: Cpu,
    accent: "text-emerald-400",
    bg: "from-emerald-500/10 to-transparent",
  },
  {
    number: "15+",
    label: "Frontier AI Labs & Creators",
    subtext: "DeepMind, OpenAI, Anthropic & more",
    icon: Globe2,
    accent: "text-blue-400",
    bg: "from-blue-500/10 to-transparent",
  },
  {
    number: "24/7",
    label: "Automated Gemini 2.0 Synthesis",
    subtext: "Multi-source RSS verified dispatches",
    icon: Sparkles,
    accent: "text-amber-400",
    bg: "from-amber-500/10 to-transparent",
  },
  {
    number: "100%",
    label: "Curated & Ad-Free Tech Specs",
    subtext: "Engineered for technical builders",
    icon: CheckCircle2,
    accent: "text-teal-400",
    bg: "from-teal-500/10 to-transparent",
  },
];

export function ImpactTelemetry() {
  return (
    <section id="telemetry" className="py-12 border-y border-white/[0.06] bg-[#0A0B10]/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl border border-white/[0.06] bg-[#0D0F16]/70 p-6 flex flex-col justify-between overflow-hidden group hover:border-white/[0.12] transition-colors"
              >
                {/* Background soft glow */}
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.bg} blur-2xl group-hover:scale-125 transition-transform`}
                />

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight ${stat.accent}`}>
                    {stat.number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <Icon className={`h-5 w-5 ${stat.accent}`} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {stat.label}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 font-normal">
                    {stat.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
