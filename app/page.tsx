'use client'
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-grid-slate-900/[0.4]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <ShieldCheck className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400">
          Sentinel Hub
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Your elite, all-in-one cybersecurity intelligence dashboard.
          Analyze threats, assess vulnerabilities, and gain actionable insights with cutting-edge tools.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <Link href="/website-analyzer">
          <Button size="lg">
            Go to Toolkit
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
