export async function fetchRecentSubmissions(handles: string[]) {
  const results = await Promise.all(
    handles.map(async (handle) => {
      const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=20`);
      const data = await res.json();
      return data.status === "OK" ? data.result : [];
    })
  );
  return results.flat();
}
