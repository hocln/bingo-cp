'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '../../Loading';
import Confetti from 'react-confetti';
import { useRef } from 'react';

// import { MatchStatus } from "./MatchStatus";
import MatchCreationForm from '../../MatchCreationForm';
import { Match } from '../../types/match';
import TeamsForm from '@/app/TeamsForm';

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
  "Home": 'http://localhost:3000/home',
  "ICPC Mode": 'http://localhost:3000/create-match',
  "IOI Mode": 'http://localhost:3000/oi_mode',
  "Help": 'http://localhost:3000/help',
};

type GridSize = 3 | 4 | 5 | 6; // Only these values are allowed

const gridClasses = {
  3: "grid-cols-3 gap-x-0 gap-y-4 justify-items-center mt-4 mx-130",
  4: "grid-cols-4 gap-x-0 gap-y-4 justify-items-center mt-4 mx-110",
  5: "grid-cols-5 gap-x-0 gap-y-4 justify-items-center mt-4 mx-90",
  6: "grid-cols-6 gap-x-0 gap-y-4 justify-items-center mt-4 mx-70",
};

type LogEntry = {
  key: string;
  message: string;
  team: string;
}

type Problem = {
  // id: number;
  name: string;
  rating: number;
  contestId: number;
  index: string;
  position?: number;
};
type SolvedInfo = {
  team: string;
  
};

type Winner = {
  team: string;
  type: 'row' | 'col' | 'diag' | 'anti-diag';
  index: number;
  keys: string[]; // list of problem keys that form the winning line, e.g. ["1234-A","1234-B",...]
} | null;
function useWindowSize() {
  const isClient = typeof window !== 'undefined';
  const [size, setSize] = useState({ width: isClient ? window.innerWidth : 0, height: isClient ? window.innerHeight : 0 });
  useEffect(() => {
    if (!isClient) return;
    function onResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [isClient]);
  return size;
}

function notifyBrowser(title: string, body?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try { new Notification(title, { body }); } catch (e) { /* ignore */ }
    return;
  }
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        try { new Notification(title, { body }); } catch (e) {}
      }
    });
  }
}

function normalizeProblemsFromServer(raw: any[]) {
  if (!Array.isArray(raw)) return [];

  const active = raw.filter(p => p && p.active !== false);
  const hasPosition = active.every(p => typeof p.position === 'number');

  if (hasPosition) {
    const byPos = new Map<number, any>();
    for (const p of active) {
      const pos = p.position as number;
      if (!byPos.has(pos)) byPos.set(pos, p);
    }
    return Array.from(byPos.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([_, p]) => p);
  }

  const seen = new Set<string>();
  const result: any[] = [];
  for (const p of active) {
    const key = `${p.contestId}-${p.index}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(p);
    }
  }
  return result;
}




export default function Home() {
  const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId; // id is now string | undefined
  
  const [showLog, setShowLog] = useState(true);
  const [currentTeam, setCurrentTeam] = useState<string>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setgridSize] = useState<GridSize>(5);
  const [solved, setSolved] = useState<Record<string, SolvedInfo>>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [now, setNow] = useState(new Date());
  
  // win / lock / confetti state
  const [winner, setWinner] = useState<Winner>(null);
  const [matchLocked, setMatchLocked] = useState(false); // prevents further marking/polling after win
  const [confettiActive, setConfettiActive] = useState(false);
  const [positionOwners, setPositionOwners] = useState<Record<number, string>>({});

  // window size (use the local hook)
  const { width, height } = useWindowSize();
  const notifiedRef = useRef<Set<string>>(new Set());

  function persistNotified(matchId: string) {
    const key = `notified_${matchId}`;
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(notifiedRef.current)));
    } catch {}
  }

  useEffect(() => {
    if (!match?.id) return;
    const key = `notified_${match.id}`;
    const raw = localStorage.getItem(key);
    try {
      const arr = raw ? JSON.parse(raw) : [];
      notifiedRef.current = new Set(arr);
    } catch {
      notifiedRef.current = new Set();
    }
  }, [match?.id]);


  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchMatch = async () => {
      try {
        const res = await fetch(`/api/getMatch?matchId=${encodeURIComponent(id)}`);
        if (!res.ok) {
          console.error('Failed to fetch match', await res.text());
          setMatch(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        const matchObj = data.match ?? data;
        setMatch(matchObj);
      try {
        const solvedMap: Record<number, SolvedInfo> = {};
        const newLogEntries: LogEntry[] = [];
        const posOwners: Record<number, string> = {};

        const teamsFromServer = matchObj.teams ?? [];

        (matchObj.solveLog ?? []).forEach((entry: any) => {
            const key = `${entry.contestId}-${entry.index}`;
            const { displayName, teamKey } = resolveTeamDisplayAndKey(entry.team, teamsFromServer);
            solvedMap[entry.problem.position] = {
              team: teamKey,
            };
            if (entry.problem && typeof entry.problem.position === 'number') {
              posOwners[entry.problem.position] = teamKey;
            }

            const problemName = entry.problem?.name ?? `Problem ${entry.index}`;
            const contestAndIndex = `${entry.contestId}${entry.index}`;
            newLogEntries.push({
              key,
              message: `${displayName} solved ${problemName} (${contestAndIndex})`,
              team: teamKey,
            });
        });
        setPositionOwners(posOwners);  // <-- set state

        setLog(prev => {
            const combined = [...newLogEntries, ...prev];
            const uniqueMap = new Map<string, LogEntry>();
            for (const e of combined) {
              if (!uniqueMap.has(e.key)) uniqueMap.set(e.key, e);
            }
          return Array.from(uniqueMap.values()).slice(0, 10);
        });
        setSolved(solvedMap);

        } catch (e) {
        console.warn('Could not build solved/log from matchObj.solveLog', e);
        }

      } catch (err) {
        console.error('Error fetching match', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);


  function resolveTeamDisplayAndKey(teamIdentifier: string | undefined, teamsListParam?: any[]) {
    const teamsList = teamsListParam ?? (match?.teams ?? []);
    if (!teamIdentifier) return { displayName: 'Unknown', teamKey: 'unknown' };

    const search = teamIdentifier.toLowerCase();
    const teamObj = teamsList.find(t =>
      (t.color ?? '').toLowerCase() === search || (t.name ?? '').toLowerCase() === search
    );

    const displayName = teamObj?.name ?? teamIdentifier;
    const teamKey = (teamObj?.color ?? teamIdentifier ?? 'unknown').toLowerCase();

    return { displayName, teamKey };
  }




  useEffect(() => {
    if (match?.teams?.length && !currentTeam) {
        setCurrentTeam(match.teams[0].color); 
    }
    }, [match]);


  useEffect(() => {
    if (matchLocked) return; // don't poll/merge updates after a win/lock
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
          const posOwners: Record<number, string> = {};

          const problemUpdates: Record<string, { name?: string; rating?: number; contestId?: number; index?:string }> = {};

          const teamsFromServer = pollData.match?.teams ?? [];
          pollData.match.solveLog.forEach((entry: any) => {
            const key = `${entry.contestId}-${entry.index}`;
            const { displayName, teamKey } = resolveTeamDisplayAndKey(entry.team, teamsFromServer);
            solvedMap[key] = {
              team: teamKey, // store color key for UI
            };

            if (entry.problem && typeof entry.problem.position === 'number') {
              posOwners[entry.problem.position] = teamKey;
            }

            if (entry.problem) {
              problemUpdates[key] = {
                name: entry.problem.name ?? undefined,
                rating: entry.problem.rating ?? undefined,
                contestId: entry.contestId,
                index: entry.index,
              };
            }

            
            const problemName = entry.problem?.name ?? `Problem ${entry.index}`;
            const contestAndIndex = `${entry.contestId}${entry.index}`;
            newLogEntries.push({
              key,
              message: `${displayName} solved ${problemName} (${contestAndIndex})`,
              team: teamKey,
            });
          });

          setSolved(solvedMap);
          setPositionOwners(posOwners);  // <-- set state

          if (pollData.match?.problems && Array.isArray(pollData.match.problems)) {
            const normalized = normalizeProblemsFromServer(pollData.match.problems);
            setProblems(normalized);
          } else if (Object.keys(problemUpdates).length > 0) {
            setProblems(prev =>
              prev.map(p => {
                const k = `${p.contestId}-${p.index}`;
                const upd = problemUpdates[k];
                if (!upd) return p;
                return {
                  ...p,
                  name: upd.name ?? p.name,
                  rating: upd.rating ?? p.rating,
                  contestId: upd.contestId ?? p.contestId,
                  index: upd.index ?? p.index,
                };
              })
            );
          }

          setSolved(solvedMap);
          setPositionOwners(posOwners);

          setLog(prevLog => {
            const combined = [...newLogEntries, ...prevLog];
            const uniqueMap = new Map<string, LogEntry>();
            for (const entry of combined) {
              if (!uniqueMap.has(entry.key)) uniqueMap.set(entry.key, entry);
            }
            const deduped = Array.from(uniqueMap.values()).slice(0, 10);

            const prevMessages = new Set(prevLog.map(x => x.message));
            newLogEntries.forEach(ne => {
              if (!prevMessages.has(ne.message) && !notifiedRef.current.has(ne.message)) {
                notifyBrowser("Solve reported", ne.message);
                notifiedRef.current.add(ne.message);
              }
            });
            if (pollData.match?.id) persistNotified(pollData.match.id);

            return deduped;
          });

        }
      } catch (err) {
        console.error('Polling submissions failed', err);
      }
    };

    fetchPoll();

    const interval = setInterval(fetchPoll, 10000); // REMEMBER TO CHANGE TO 15S
    return () => clearInterval(interval);
    }, [match?.id, match?.startTime, match?.durationMinutes, matchLocked]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!match) return;
    const start = new Date(match.startTime);
    const end = new Date(start.getTime() + match.durationMinutes * 60 * 1000);
    const now = new Date();

    if (now >= end) {
        setMatchLocked(true);
    }
  }, [match]);

  useEffect(() => {
    if (!match) return;
    // console.log("for crying out loud: ", match.problems)
    const len = match.problems?.length ?? 0;
    if(len === 36) setgridSize(6 as GridSize);
    else if(len === 25) setgridSize(5 as GridSize);
    else if(len === 16) setgridSize(4 as GridSize);
    else setgridSize(3 as GridSize);
    const normalized = normalizeProblemsFromServer(match.problems || []);
    setProblems(normalized); // problems now have contestId, index, name, rating, position
    setLoading(false);
  }, [match]);
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
        Match starts in {formatDuration(startTime.getTime() - Date.now())}
      </p>
    );
  }


  useEffect(() => {
    if (!problems || problems.length === 0) return;
    if (matchLocked) return; // already locked
    // console.log("HHHEHEHE:")
    const w = findWinnerFromSolved(solved, problems, gridSize);
    if (w && !winner) {
        setWinner(w);
        setConfettiActive(true);
        setMatchLocked(true);
        const teamObj = match?.teams?.find(
            t => t.color?.toLowerCase() === currentTeam?.toLowerCase() || t.name?.toLowerCase() === currentTeam?.toLowerCase()
        );
        const displayName = teamObj?.name ?? currentTeam;
        const teamKey = teamObj?.color?.toLowerCase() ?? currentTeam?.toLowerCase?.() ?? 'unknown';

        setLog(prev => {
        const problemList = w.keys.map(k => k.replace('-', '')).join(', '); // basic formatting
        const finalMsg = `${displayName} completed ${w.type === 'row' ? 'a row' : w.type === 'col' ? 'a column' : w.type === 'diag' ? 'the main diagonal' : 'the anti-diagonal'}`;
        return [{ message: finalMsg, team: w.team.toLowerCase(), key: "" }, ...prev].slice(0, 10);
        });

    }
    }, [solved,problems , winner]);

  function findWinnerFromSolved(solvedMap: Record<string, SolvedInfo>, problemsArr: Problem[], gSize: number): Winner {
    if (!problemsArr || problemsArr.length === 0) return null;
    const size = gSize;
    if (problemsArr.length !== size * size) {
      console.warn(`findWinnerFromSolved: mismatch problems.length (${problemsArr.length}) vs expected (${size * size}). Skipping winner detection.`);
      return null;
    }
    const ownerGrid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
    for (let i = 0; i < problemsArr.length; i++) {
        const r = Math.floor(i / size);
        const c = i % size;
        ownerGrid[r][c] = solvedMap[i]?.team ?? null;
    }

    // rows
    for (let r = 0; r < size; r++) {
        const first = ownerGrid[r][0];
        if (first && ownerGrid[r].every(cell => cell === first)) {
        const keys = Array.from({length: size}, (_, c) => `${problemsArr[r*size + c].contestId}-${problemsArr[r*size + c].index}`);
        return { team: first, type: 'row', index: r, keys };
        }
    }

    // columns
    for (let c = 0; c < size; c++) {
        const first = ownerGrid[0][c];
        if (first && ownerGrid.every(row => row[c] === first)) {
        const keys = Array.from({length: size}, (_, r) => `${problemsArr[r*size + c].contestId}-${problemsArr[r*size + c].index}`);
        return { team: first, type: 'col', index: c, keys };
        }
    }

    // main diagonal
    const firstDiag = ownerGrid[0][0];
    if (firstDiag && ownerGrid.every((row, i) => row[i] === firstDiag)) {
        const keys = Array.from({length: size}, (_, i) => `${problemsArr[i*size + i].contestId}-${problemsArr[i*size + i].index}`);
        return { team: firstDiag, type: 'diag', index: 0, keys };
    }

    // anti-diagonal
    const firstAnti = ownerGrid[0][size - 1];
    if (firstAnti && ownerGrid.every((row, i) => row[size - 1 - i] === firstAnti)) {
        const keys = Array.from({length: size}, (_, i) => `${problemsArr[i*size + (size - 1 - i)].contestId}-${problemsArr[i*size + (size - 1 - i)].index}`);
        return { team: firstAnti, type: 'anti-diag', index: 1, keys };
    }

    return null;
    }


  function toggleSquare(i: number) {
    if (matchLocked) return;
    const key = `${problems[i].contestId}-${problems[i].index}`;
    if (solved[key]) return;

    const time = new Date().toLocaleTimeString();
    setSolved(prev => ({ ...prev, [key]: { team: currentTeam, timestamp: time } }));
    const prob = problems[i];
    const problemId = `${prob.contestId}${prob.index}`;
    const teamObj = match?.teams?.find(
        t => t.color?.toLowerCase() === currentTeam?.toLowerCase() || t.name?.toLowerCase() === currentTeam?.toLowerCase()
    );
    
    const displayName = teamObj?.name ?? currentTeam;
    const teamKey = teamObj?.color?.toLowerCase() ?? currentTeam?.toLowerCase?.() ?? 'unknown';
    const newEntry = {
        key,
        message: `${displayName} solved ${prob.name} (${problemId})`,
        team: teamKey,
    };

    setLog(prev => {
      const combined = [newEntry, ...prev];

      const uniqueMap = new Map<string, typeof newEntry>();
      for (const entry of combined) {
        if (!uniqueMap.has(entry.key)) {
          uniqueMap.set(entry.key, entry);
        }
      }
      return Array.from(uniqueMap.values()).slice(0, 10);
    });
  }


  if (loading) return <Loading />;      // while fetching
  if(!match) {
    return <main className="p-6">Match not found</main>;
  }

  const matchStart = new Date(match.startTime);
  const matchEnd = new Date(matchStart.getTime() + match.durationMinutes * 60 * 1000);
  const currentTime = new Date();

  const matchHasStarted = currentTime >= matchStart;
  const matchHasEnded = currentTime >= matchEnd;
  const matchOngoing = matchHasStarted && !matchHasEnded && !matchLocked;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

            {/* Confetti on winner */}
            {winner && confettiActive && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}


      {/* Header */}
      <header className="w-full bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <a href="http://localhost:3000/home">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide">
              Bingo CP
            </h1>
          </a>
          <div className="flex items-center space-x-4 border-l pl-6 ml-4 dark:border-gray-600">
            {['Home', 'ICPC Mode', 'IOI Mode', 'Help'].map(label => (
              <a href={`${links[label]}`}>
                <button key={label} className="cursor-pointer px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                  {label}
                </button>
              </a>
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
          {problems.map((problem, idx) => {
            const key = `${problem.contestId}-${problem.index}`;
            const solvedInfo = solved[key];
            const ownerTeam = solvedInfo?.team ?? positionOwners[problem.position ?? idx]; // fallback by position
            const isWinningCell = winner?.keys?.includes(key);
            // console.log('Rendering problem', key, 'solved by', solvedInfo?.team, 'teamColor:', teamColors[solvedInfo?.team]);
            const teamColor = ownerTeam
              ? (teamColors[ownerTeam] || 'bg-gray-500 text-white')
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
                // onDoubleClick={() => { // DONT forget to remove it later
                // // double click will locally mark for testing (toggleSquare) but disabled after lock
                // if (!matchLocked) toggleSquare(idx);
                // }}
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add('scale-[1.04]', 'shadow-md');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove('scale-[1.04]', 'shadow-md');
                }}
                className={`w-36 h-24 p-2 flex flex-col justify-center items-center text-center rounded shadow cursor-pointer transition duration-200
                  ${teamColor} ${ownerTeam ? 'text-white' : ''} ${isWinningCell ? ' ring-4 ring-yellow-400 scale-[1.06]' : ''}`}
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
