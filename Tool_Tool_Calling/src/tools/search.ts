export async function search(query: string) {
  const res = await fetch(
    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
  );

  const data = await res.json();

  if (data.Abstract) return data.Abstract;

  if (data.RelatedTopics?.length > 0) {
    return data.RelatedTopics
      .map((t: any) => t.Text)
      .filter(Boolean)
      .join("\n");
  }

  return "No useful search results found";
}