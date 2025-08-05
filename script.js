function extractCardIDs(link) {
  try {
    const url = new URL(link);
    const deckParam = url.searchParams.get("deck");
    if (!deckParam) return [];

    const rawIDs = deckParam.split(";");
    const validIDs = rawIDs.filter(id => id.startsWith("2600") && cardMap[id]);
    return validIDs;
  } catch (e) {
    return [];
  }
}
