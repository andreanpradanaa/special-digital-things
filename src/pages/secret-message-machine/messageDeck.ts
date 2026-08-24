import { secretMessageIds, type MessageId } from './secretMessageContent.ts'

export type Random = () => number

export function shuffleMessageIds(
  ids: readonly MessageId[] = secretMessageIds,
  random: Random = Math.random,
): MessageId[] {
  const deck = [...ids]

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]]
  }

  return deck
}

export function freshMessageDeck(random: Random = Math.random): MessageId[] {
  return shuffleMessageIds(secretMessageIds, random)
}
