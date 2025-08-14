"use client";

import React from "react";
import { motion } from "framer-motion";

export default function OIModeComingSoon(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-6 py-20">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Illustration / badge */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 flex items-center justify-center"
          >
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl flex items-center justify-center"
              >
                <div className="text-white text-center p-4">
                  <svg className="mx-auto mb-2 w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2L15 8l6 .5-4.5 3.5L18 20l-6-4-6 4 1.5-8L3 8.5 9 8l3-6z" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-sm font-semibold">IOI Mode</div>
                </div>
              </motion.div>

              <div className="absolute -bottom-4 -left-6 bg-white/90 dark:bg-gray-800/80 px-3 py-1 rounded-xl shadow-sm text-xs">
                Coming soon
              </div>
            </div>
          </motion.div>

          {/* Text + CTA */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full md:w-1/2"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
              IOI Mode — Coming soon to Bingo CP
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              IOI Mode lets tiles be decided by partial scores — the highest-scoring submission claims the tile,
              with ties broken by submission time. We're polishing judge integrations and testing reliability
              so the experience is fair and fast.
            </p>

            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-6">
              <li>• Partial scoring support (for tasks with subtasks)</li>
              <li>• Tie-breaks by earliest valid submission</li>
              <li>• Careful verification to avoid false positives from judge downtime</li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm hover:shadow transition"
              >
                Back to Home
              </a>

              <a
                href="/help"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:underline"
              >
                Learn more
              </a>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              We’ll reach out to everyone who requested notification via the email above when IOI Mode is ready.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
