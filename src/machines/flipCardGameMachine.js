import { Machine, assign } from 'xstate';

export const flipCardGameMachine = Machine({
  id: 'flipCardGame',
  initial: 'standby',
  context: {
    correctCardIndexes: [],
    flippingCardIndexes: [],
    allCards: [],
  },
  states: {
    standby: {
      on: {
        START_GAME: {
          target: 'playing',
          actions: assign((context, event) => ({
            correctCardIndexes: [],
            flippingCardIndexes: [],
            allCards: event.allCards,
          })),
        },
      },
    },
    playing: {
      on: {
        '': {
          target: 'won',
          cond: (context, _event) => context.correctCardIndexes.length === context.allCards.length,
        },
        FLIP_CARD: {
          actions: assign((context, event) => ({
            ...context,
            flippingCardIndexes: [...context.flippingCardIndexes, event.index],
          })),
          cond: (context) => context.flippingCardIndexes.length < 2,
        },
        UNFLIP_CARD: {
          actions: assign((context, event) => ({
            ...context,
            flippingCardIndexes: context.flippingCardIndexes.filter((index) => index !== event.index),
          })),
        },
        CHECK_CARDS_CORRECT: {
          actions: assign((context, event) => {
            const [firstIndex, secondIndex] = context.flippingCardIndexes;

            if (context.allCards[firstIndex] === context.allCards[secondIndex]) {
              return {
                ...context,
                flippingCardIndexes: [],
                correctCardIndexes: [...context.correctCardIndexes, firstIndex, secondIndex],
              };
            }

            return {
              ...context,
              flippingCardIndexes: [],
            };
          }),
          cond: (context) => context.flippingCardIndexes.length === 2,
        },
      },
    },
    won: {
      on: {
        RESET_GAME: {
          target: 'standby',
        },
      },
    },
  },
});
