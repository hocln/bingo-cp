"use client";
import React from "react";
import { motion } from "framer-motion";

export default function HelpPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Help — Bingo CP</h1>
          <a
            href="/create-match"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow"
          >
            Create match
          </a>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Need a hand? This page explains the main game mode, how problems are chosen, a short FAQ for players,
          and a few troubleshooting tips.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold mb-3">CPC Mode (Classic)</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              CPC mode is the default, player-friendly mode. Each tile contains a real competitive
              programming problem. When a team member submits a correct solution on Codeforces,
              that tile is automatically claimed for their team. The first team to form a full row,
              column, or diagonal wins.
            </p>

            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div>
                <strong>Why CPC mode?</strong>
                <div className="mt-1">
                  It's simple and social: teams race to solve problems, and the board updates automatically.
                  No manual claiming is required.
                </div>
              </div>

              <div>
                <strong>Replace mode (optional)</strong>
                <div className="mt-1">
                  If enabled, when a tile is claimed it is replaced immediately with a new problem so the
                  board stays full. This keeps matches continuous and longer without downtime.
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold mb-3">How problems are chosen</h2>
            <ul className="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>We pull a large pool of problems from the configured judge (DMOJ or similar).</li>
              <li>
                Problems are filtered so that none of the players in the match have attempted or solved them before —
                this keeps the match fair.
              </li>
              <li>From that filtered pool we pick random problems to populate the grid you see.</li>
            </ul>
          </motion.article>
        </section>

        <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3">Quick start (players)</h2>
          <ol className="list-decimal list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
            <li>Ask the match creator for the start time and the team you are on.</li>
            <li>Log in to the judge (Codeforces/DMOJ) and make sure the handle provided to the match is correct.</li>
            <li>When the match starts, open the problem on the judge, solve, and submit as usual.</li>
            <li>If your submission is accepted, the tile will be claimed automatically for your team.</li>
          </ol>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow"
        >
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>

            {/* Accordion data */}
            {(() => {
            const faqs = [
                {
                q: "Do I need an account?",
                a: "Yes — you must provide a handle on the judge (Codeforces/DMOJ). We use that handle to automatically detect your accepted submissions."
                },
                {
                q: "Can I join a match without being invited?",
                a: "Not currently. Matches are created by a host and the host shares the match link with participants."
                },
                {
                q: "What happens if the judge's API is slow?",
                a: "Submission detection may take a few seconds. The system polls the judge periodically and will update tiles as soon as it confirms a valid accepted submission."
                },
                {
                q: "I solved a problem but the grid didn't update. What should I do?",
                a: "Give it a moment (typically 10–30 seconds). If it still doesn't update, verify that the handle in the match matches the handle you used to submit and that your submission shows as accepted on the judge. Note: the judge may throttle its API during official contest rounds — avoid starting matches during major contests."
                },
                {
                q: "I solved a problem but nothing got replaced (Replace mode).",
                a: "If Replace mode is enabled, replacement usually takes a few seconds. If the tile remains unchanged, try refreshing the page. If it still fails, the host should check server logs or contact support."
                },
                {
                q: "I pressed \"Create match\" but nothing happened — how long should it take?",
                a: "Match creation can take time depending on the number of handles and the size of the problem pool. It may take up to 30–40 seconds in some cases. If it takes much longer, check your network and server logs or try again."
                }
            ];

            const [openIndex, setOpenIndex] = React.useState<number | null>(null);

            return (
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                {faqs.map((item, i) => {
                    const open = openIndex === i;
                    return (
                    <div key={i} className="border-b border-gray-100 dark:border-gray-700 pb-3">
                        <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenIndex(open ? null : i)}
                        className="w-full text-left flex items-center justify-between gap-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md
                                    cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-2"
                        >
                        <span className="font-medium">{`Q: ${item.q}`}</span>
                        <svg
                            className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : "rotate-0"} text-gray-500`}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden
                        >
                            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </button>

                        <div
                        className={`mt-1 text-sm text-gray-600 dark:text-gray-300 transition-all overflow-hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                        aria-hidden={!open}
                        >
                        <p>{item.a}</p>
                        </div>
                    </div>
                    );
                })}
                </div>
            );
            })()}
        </motion.div>
        </section>


        <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3">Contact & Feedback</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Found a bug or want to request a feature? Please reach out:
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:bingocp.official@gmail.com"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
            >
              Email: bingocp.official@gmail.com
            </a>
            <a
              href="https://github.com/hocln"
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm"
            >
              Project repo
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-700 py-6">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Bingo CP — help & documentation.
        </div>
      </footer>
    </div>
  );
}
