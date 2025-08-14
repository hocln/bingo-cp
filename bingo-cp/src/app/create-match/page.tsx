'use client';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
// import { MatchStatus } from "./MatchStatus";
import MatchCreationForm from '../MatchCreationForm';
import { Match, ProblemCell } from '../types/match';
type solveLog = {
  id: number;
  handle: string;
  team: string;
  contestId: number;
  index: string;
  timestamp: Date;
  score: number;
  match: Match;
  matchId: string;
  problem: ProblemCell;
}
const teamColors: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  yellow: 'bg-yellow-500',
  teal: 'bg-teal-500',
};

const links: Record<string, string> = {
  "Home": '/home',
  "ICPC Mode": '/create-match',
  "IOI Mode": '/oi_mode',
  "Help": '/help',
};


type GridSize = 3 | 4 | 5 | 6; 

const gridClasses = {
  3: "grid-cols-3 gap-x-0 gap-y-4 justify-items-center mt-4 mx-130",
  4: "grid-cols-4 gap-x-0 gap-y-4 justify-items-center mt-4 mx-110",
  5: "grid-cols-5 gap-x-0 gap-y-4 justify-items-center mt-4 mx-90",
  6: "grid-cols-6 gap-x-0 gap-y-4 justify-items-center mt-4 mx-70",
};

type LogEntry = {
  message: string;
  team: string;
}

type Problem = {
  // id: number;
  name: string;
  rating: number;
  contestId: number;
  index: string;
};
type SolvedInfo = {
  team: string;
  timestamp: string;
};

export default function Home() {
  const [showLog, setShowLog] = useState(true);
  const [currentTeam, setCurrentTeam] = useState<string>('Team Red');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setgridSize] = useState<GridSize>(5);
  const [solved, setSolved] = useState<Record<string, SolvedInfo>>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    if (!match?.id) return;

    const matchStart = new Date(match.startTime);
    const matchEnd = new Date(matchStart.getTime() + match.durationMinutes * 60 * 1000);

    const fetchPoll = async () => {
      const now = new Date();
      if (now < matchStart || now > matchEnd) {
        return;
      }
      try {
        const pollRes = await fetch('/api/poll-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId: match.id }),
        });
        const pollData = await pollRes.json();

        if (pollData.updated && pollData.match) {
          setMatch(pollData.match);

          const solvedMap: Record<string, SolvedInfo> = {};
          const newLogEntries: LogEntry[] = [];

          pollData.match.solveLog.forEach((entry: solveLog) => {
            const key = `${entry.contestId}-${entry.index}`;
            
            solvedMap[key] = {
              team: entry.team,
              timestamp: new Date(entry.timestamp).toLocaleTimeString(),
            };

            newLogEntries.push({
              message: `${solvedMap[key].timestamp} — ${entry.team} solved problem ${key}`,
              team: entry.team.toLowerCase(), // make sure matches teamColors keys
            });
          });

          setSolved(solvedMap);

          setLog(prevLog => {
          const combined = [...newLogEntries, ...prevLog];
          const uniqueMap = new Map<string, { message: string; team: string }>();
          for (const entry of combined) {
            if (!uniqueMap.has(entry.message)) {
              uniqueMap.set(entry.message, entry);
            }
          }
          return Array.from(uniqueMap.values()).slice(0, 10);
        });
        }
      } catch (err) {
        console.error('Polling submissions failed', err);
      }
    };

    fetchPoll();

    const interval = setInterval(fetchPoll, 15000);
    return () => clearInterval(interval);
  }, [match?.id, match?.startTime, match?.durationMinutes]);




  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval);
  }, []);
  function formatDuration(ms: number) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
  function formatCountdown(ms: number): string {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }


  function CountdownToStart({ startTime }: { startTime: Date }) {
    const [timeLeft, setTimeLeft] = useState(() => startTime.getTime() - Date.now());

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(startTime.getTime() - Date.now());
      }, 1000);

      return () => clearInterval(interval);
    }, [startTime]);

    if (timeLeft <= 0) {
      return <p>Match is starting now...</p>;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return (
      <p className="text-yellow-500">
        Match starts in {formatDuration(matchStart.getTime() - Date.now())}
      </p>
    );
  }
  useEffect(() => {
    if (!match) return;
    if(match.problems.length == 36) setgridSize(6);
    else if(match.problems.length == 25) setgridSize(5);
    else if(match.problems.length == 16) setgridSize(4);
    else setgridSize(3);
    setProblems(match.problems);
    setLoading(false);
  }, [match]);
  function toggleSquare(i: number) {
    const key = `${problems[i].contestId}-${problems[i].index}`;
    if (solved[key]) return;

    const time = new Date().toLocaleTimeString();
    setSolved(prev => ({ ...prev, [key]: { team: currentTeam, timestamp: time } }));
    setLog(prev => {
      const newEntry = {
        message: `${time} — ${currentTeam} solved ${problems[i].name}`,
        team: currentTeam.toLowerCase(),
      };
      const combined = [newEntry, ...prev];

      const uniqueMap = new Map<string, typeof newEntry>();
      for (const entry of combined) {
        if (!uniqueMap.has(entry.message)) {
          uniqueMap.set(entry.message, entry);
        }
      }
      return Array.from(uniqueMap.values()).slice(0, 10);
    });
  }

  if (!match) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Header */}
        <header className="w-full bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
            <a href="/home">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide">
                Bingo CP
              </h1>
            </a>
            <div className="flex items-center space-x-4 border-l pl-6 ml-4 dark:border-gray-600">
            <a href={`${links['Home']}`}>
              <button key={'Home'} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                {'Home'}
              </button>
            </a>
            <a href={`${links['ICPC Mode']}`}>
              <button key={'ICPC Mode'} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                {'ICPC Mode'}
              </button>
            </a>
            <a href={`${links['IOI Mode']}`}>
              <button key={'IOI Mode'} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                {'IOI Mode'}
              </button>
            </a>
            <a href={`${links['Help']}`}>
              <button key={'Help'} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                {'Help'}
              </button>
            </a>
              {/* {['Home', 'ICPC Mode', 'IOI Mode', 'Help'].map(label => (
                <a href={`${links[label]}`}>
                  <button key={label} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                    {label}
                  </button>
                </a>
              ))} */}
            </div>
          </div>
        </header>

        {/* Match creation UI */}
        <div className="flex justify-center mt-4">
          <MatchCreationForm onMatchCreated={setMatch} />
        </div>
        <p className="text-center mt-10">Create a match to start playing</p>
      </main>
    );
  }

  const matchStart = new Date(match.startTime);
  const matchEnd = new Date(matchStart.getTime() + match.durationMinutes * 60 * 1000);
  const currentTime = new Date();

  const matchHasStarted = currentTime >= matchStart;
  const matchHasEnded = currentTime >= matchEnd;
  const matchOngoing = matchHasStarted && !matchHasEnded;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="w-full bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide">
            Bingo CP
          </h1>
          <div className="flex items-center space-x-4 border-l pl-6 ml-4 dark:border-gray-600">
            {['Home', 'ICPC Mode', 'IOI Mode', 'Help'].map(label => (
              <button key={label} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Show time info */}
      <div className="text-center mt-4">
        {!matchHasStarted && (
          <CountdownToStart startTime={matchStart} />
        )}
        {matchHasEnded && (
          <p className="text-red-500">Match has ended.</p>
        )}
        {matchOngoing && match && (
        <p className="text-green-500">
          Match ends in {formatDuration(matchEnd.getTime() - Date.now())}
        </p>
          )}
      </div>

      {/* Show problem grid always during or after match */}
      {matchHasStarted ? ( 
      loading ? (
        <Loading />
      ) : (
        <div className={`grid ${gridClasses[gridSize]} gap-x-0 gap-y-4 justify-items-center mt-4 mx-70`}>
          {problems.map((problem) => {
            const key = `${problem.contestId}-${problem.index}`;
            const solvedInfo = solved[key];
            const teamColor = solvedInfo
              ? teamColors[solvedInfo.team] || 'bg-gray-500 text-white'
              : 'bg-white hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900 text-gray-800 dark:text-gray-200';

            return (
              <div
                key={`${problem.contestId}-${problem.index}`}
                onClick={() =>
                  window.open(
                    `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`,
                    '_blank'
                  )
                }
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add('scale-[1.04]', 'shadow-md');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove('scale-[1.04]', 'shadow-md');
                }}
                className={`w-36 h-24 p-2 flex flex-col justify-center items-center text-center rounded shadow cursor-pointer transition duration-200
                  ${teamColor} ${solvedInfo ? 'text-white' : ''}`}
              >
                <div className="text-sm font-semibold">
                  {problem.rating} - {problem.index}
                </div>
                <div className="text-xs mt-1">{problem.name}</div>
              </div>
            );
          })}
        </div>
        )
      ): null}

      {/* Log Panel */}
      {showLog && (
        <div className="fixed bottom-4 left-1 w-72 max-h-[80vh] overflow-y-auto border rounded p-3 bg-white dark:bg-gray-900 shadow z-30">
          <h2 className="text-xl font-semibold mb-2">Solve Log</h2>
          {log.length === 0 ? (
            <p className="text-sm text-gray-500">No solves yet</p>
          ) : (
            <ul className="text-sm space-y-2">
              {log.map((entry, idx) => {
                const bgColor = teamColors[entry.team] || 'bg-gray-200 dark:bg-gray-700';
                return (
                  <li
                    key={idx}
                    className={`${bgColor} text-white px-3 py-2 rounded shadow-sm`}
                  >
                    {entry.message}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Toggle Button (above log) */}
      <button
        onClick={() => setShowLog(prev => !prev)}
        className="cursor-pointer fixed bottom-[calc(4rem+76vh)] left-4 px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition z-40"
      >
        {showLog ? 'Hide Log' : 'Show Log'}
      </button>
    </main>
  );
}
