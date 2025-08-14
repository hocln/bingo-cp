// app/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function HomePage(): React.JSX.Element {
  const sampleGrid = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    rating: [800, 900, 1000, 1200, 1500][i % 5],
    label: String.fromCharCode(65 + (i % 5)),
    name: `Problem ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Bingo <span className="text-gray-900 dark:text-white">CP</span>
          </h1>
          <nav className="flex items-center gap-3">
            <a
              href="/create-match"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow"
            >
              Create match
            </a>
            {/* Join removed intentionally */}
            <a
              href="/help"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md text-sm"
            >
              Help
            </a>
          </nav>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Competitive programming — turned into a social, party-ready game.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Pick a grid, invite friends or teammates, and race to claim squares by solving real
              competitive programming problems. First line wins — or in special modes, highest score
              claims the square. Fast, fair, and surprisingly addictive.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/create-match"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold shadow-lg"
              >
                Create a Match
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                How it works
              </a>
            </div>

            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-md">
              <strong>Note:</strong> IOI-style mode is coming soon — placeholder shown on the match
              creation page.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Sample 5×5 Match
              </div>
              <div className="grid grid-cols-5 gap-3">
                {sampleGrid.map((p) => (
                  <div
                    key={p.id}
                    className="h-20 rounded-lg flex flex-col items-center justify-center text-center text-xs font-semibold border border-gray-100 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-850 dark:to-gray-900 hover:scale-105 transition-transform"
                  >
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{p.rating}</div>
                    <div className="mt-1 text-sm">{p.label}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{p.name}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Squares are claimed automatically when a team member submits a successful solution.
                First line (row/col/diag) wins the match.
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features + How To */}
      <main className="max-w-6xl mx-auto px-6 py-12" id="how">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md"
          >
            <h3 className="font-semibold text-lg mb-2">Fast Matches</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Create matches with a custom grid (3×3 to 6×6), invite teams, and set the duration —
              perfect for warmups or tournaments.
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md"
          >
            <h3 className="font-semibold text-lg mb-2">Fair Play</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Problems are selected so that no participant has attempted them before. Automatic
              submission polling detects the first correct or highest scoring submission.
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md"
          >
            <h3 className="font-semibold text-lg mb-2">Multiple Modes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Classic mode (first AC claims) is available now. IOI-style scoring will appear soon —
              announced right on the match page.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <strong>Replace mode:</strong>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  When a square is claimed, it is instantly replaced with a fresh problem so play
                  continues with a full board. You can configure a rating increment (e.g. +100) so
                  replacement problems grow harder over time. Problems chosen for replacement are
                  filtered so no current participant has attempted them before — keeping the match
                  fair and fast-paced.
                </p>
              </div>
              <div>
                <strong>Classic mode:</strong>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  First accepted solution (AC) claims the square. Simple and competitive — perfect
                  for short matches and party play.
                </p>
              </div>
              <div>
                <strong>IOI mode (coming soon):</strong>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Tiles are decided by highest score (ties broken by earliest submission). This mode
                  is ideal for tasks with partial scoring.
                </p>
              </div>
            </div>
          </motion.article>
        </section>

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
          >
            <h3 className="text-xl font-bold mb-3">How to play</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <strong>Create a match:</strong> choose grid size, teams, and start time.
              </li>
              <li>
                <strong>Invite teammates:</strong> each team can have 1–4 handles (unique across the
                match).
              </li>
              <li>
                <strong>Start the match:</strong> problems appear — teams race to solve them on the
                original judge.
              </li>
              <li>
                <strong>Claim squares:</strong> the player who submits the winning solution (first AC
                in Classic) claims the square for their team.
              </li>
              <li>
                <strong>Win:</strong> complete a full row, column, or diagonal — or be highest in IOI
                mode when enabled.
              </li>
            </ol>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Built for speed and fairness. Matches are tracked with solve logs and visual celebrate
              effects when someone wins.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-md"
          >
            <h3 className="text-xl font-bold mb-3">Why Bingo CP?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              It turns routine practice into a shared event. Run practice sessions, friendly
              competitions, or rapid warm-ups. The UI is designed to be clear at a glance — problem
              ratings, indices, and claim status are visible on each tile.
            </p>

            <div className="mt-4 flex gap-3">
              <a href="/create-match" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
                Get started
              </a>
              <a href="/help" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                Learn more
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-700 mt-8 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Bingo CP — built for competitive programmers.
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/help" className="text-gray-600 dark:text-gray-400 hover:underline">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
