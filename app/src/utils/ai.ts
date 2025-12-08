
export async function checkUniqueness(ideaText: string): Promise<boolean> {

  await new Promise(resolve => setTimeout(resolve, 1000));

  return !ideaText.includes('duplicate');
}
