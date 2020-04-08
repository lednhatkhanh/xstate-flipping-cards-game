import { Machine, assign } from 'xstate';

const id = 'flippingCardsGame';

export const flippingCardsGame = Machine(
  {
    id,
    initial: 'standby',
    context: {
      correctIndexes: [],
      flippedIndexes: [],
      allCards: [],
      flipCardDuration: 0,
    },
    states: {
      standby: {
        type: 'atomic',
        on: {
          START_GAME: {
            target: 'playing',
            actions: 'start',
          },
        },
      },
      playing: {
        initial: 'flippedZero',
        type: 'compound',
        states: {
          flippedZero: {
            type: 'atomic',
            entry: 'unflipAll',
            on: {
              '': {
                target: `#${id}.won`,
                cond: (context, _event) => context.correctIndexes.length === context.allCards.length,
              },
              FLIP: {
                target: 'flippedOne',
                actions: 'flip',
              },
            },
          },
          flippedOne: {
            type: 'atomic',
            after: {
              UNFLIP_WAIT_TIMEOUT: {
                target: 'flippedZero',
              },
            },
            on: {
              FLIP: {
                target: 'flippedTwo',
                actions: 'flip',
              },
            },
          },
          flippedTwo: {
            type: 'atomic',
            entry: 'checkCorrect',
            after: {
              FLIP_DURATION: 'flippedZero',
            },
          },
        },
      },
      won: {
        type: 'atomic',
        on: {
          RESET_GAME: {
            target: 'standby',
            actions: 'reset',
          },
        },
      },
    },
  },
  {
    actions: {
      start: assign((context, event) => ({
        ...context,
        allCards: event.allCards,
        flipCardDuration: event.flipCardDuration,
      })),
      flip: assign((context, event) => ({
        ...context,
        flippedIndexes: [...context.flippedIndexes, event.index],
      })),
      unflipAll: assign((context, _event) => ({
        ...context,
        flippedIndexes: [],
      })),
      checkCorrect: assign((context) => {
        const [firstIndex, secondIndex] = context.flippedIndexes;
        const firstCard = context.allCards[firstIndex];
        const secondCard = context.allCards[secondIndex];

        if (firstCard === secondCard) {
          return {
            ...context,
            correctIndexes: [...context.correctIndexes, firstIndex, secondIndex],
          };
        }

        return {
          ...context,
        };
      }),
      reset: assign(() => ({
        correctIndexes: [],
        flippedIndexes: [],
        allCards: [],
        flipCardDuration: 0,
      })),
    },
    delays: {
      FLIP_DURATION: (context) => context.flipCardDuration,
      UNFLIP_WAIT_TIMEOUT: (context) => context.flipCardDuration * 2,
    },
  },
);
