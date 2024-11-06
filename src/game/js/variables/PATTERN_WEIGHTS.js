let leftLane = -0.5;
let rightLane = 0.5;
let middleLane = 0;

export const PATTERN_WEIGHTS = [
    {
        id: 0,
        pattern: {obstacles: [leftLane], coins: [], ramps: [], slideObstacles: [], jumpObstacles: []},
        weight: 20
    },
    {
        id: 1,
        pattern: {obstacles: [middleLane], coins: [], ramps: [], slideObstacles: [], jumpObstacles: []},
        weight: 20
    },
    {
        id: 2,
        pattern: {obstacles: [rightLane], coins: [], ramps: [], slideObstacles: [], jumpObstacles: []},
        weight: 20
    },

    {
        id: 3,
        pattern: {obstacles: [], coins: [leftLane], ramps: [], slideObstacles: [leftLane], jumpObstacles: []},
        weight: 20
    },
    {
        id: 4,
        pattern: {obstacles: [], coins: [middleLane], ramps: [], slideObstacles: [middleLane], jumpObstacles: []},
        weight: 20
    },
    {
        id: 5,
        pattern: {obstacles: [], coins: [rightLane], ramps: [], slideObstacles: [rightLane], jumpObstacles: []},
        weight: 20
    },

    {
        id: 6,
        pattern: {obstacles: [], coins: [leftLane], ramps: [], slideObstacles: [], jumpObstacles: [leftLane]},
        weight: 20
    },
    {
        id: 7,
        pattern: {obstacles: [], coins: [middleLane], ramps: [], slideObstacles: [], jumpObstacles: [middleLane]},
        weight: 20
    },
    {
        id: 8,
        pattern: {obstacles: [], coins: [rightLane], ramps: [], slideObstacles: [], jumpObstacles: [rightLane]},
        weight: 20
    },

    {
        id: 9,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 50
    },
    {
        id: 10,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [middleLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 50
    },
    {
        id: 11,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [leftLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 50
    },

    {
        id: 12,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [],
            ramps: [rightLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 13,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [],
            ramps: [middleLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 14,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [],
            ramps: [leftLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },

    {
        id: 15,
        pattern: {
            obstacles: [],
            coins: [leftLane, middleLane],
            ramps: [],
            slideObstacles: [rightLane],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 16,
        pattern: {
            obstacles: [],
            coins: [leftLane, rightLane],
            ramps: [],
            slideObstacles: [middleLane],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 17,
        pattern: {
            obstacles: [],
            coins: [middleLane, rightLane],
            ramps: [],
            slideObstacles: [leftLane],
            jumpObstacles: []
        },
        weight: 30
    },

    {
        id: 18,
        pattern: {
            obstacles: [leftLane],
            coins: [],
            ramps: [],
            slideObstacles: [middleLane, rightLane],
            jumpObstacles: []
        },
        weight: 20
    },
    {
        id: 19,
        pattern: {
            obstacles: [middleLane],
            coins: [],
            ramps: [],
            slideObstacles: [leftLane, rightLane],
            jumpObstacles: []
        },
        weight: 20
    },
    {
        id: 20,
        pattern: {
            obstacles: [rightLane],
            coins: [],
            ramps: [],
            slideObstacles: [leftLane, middleLane],
            jumpObstacles: []
        },
        weight: 20
    },

    {
        id: 21,
        pattern: {
            obstacles: [leftLane, middleLane, rightLane],
            coins: [],
            ramps: [middleLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 60
    },
    {
        id: 22,
        pattern: {
            obstacles: [leftLane, middleLane, rightLane],
            coins: [],
            ramps: [leftLane, middleLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 50
    },

    {
        id: 25,
        pattern: {
            obstacles: [],
            coins: [leftLane, middleLane, rightLane],
            ramps: [],
            slideObstacles: [leftLane],
            jumpObstacles: []
        },
        weight: 30
    },

    {
        id: 26,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [],
            ramps: [],
            slideObstacles: [rightLane],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 27,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [],
            ramps: [],
            slideObstacles: [middleLane],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 28,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [],
            ramps: [],
            slideObstacles: [leftLane],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 29,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [],
            ramps: [],
            jumpObstacles: [rightLane],
            slideObstacles: []
        },
        weight: 40
    },
    {
        id: 30,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [],
            ramps: [],
            jumpObstacles: [middleLane],
            slideObstacles: []
        },
        weight: 40
    },
    {
        id: 31,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [],
            ramps: [],
            jumpObstacles: [leftLane],
            slideObstacles: []
        },
        weight: 40
    },
    {
        id: 32,
        pattern: {
            obstacles: [leftLane],
            coins: [middleLane, rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 33,
        pattern: {
            obstacles: [middleLane],
            coins: [leftLane, rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 34,
        pattern: {
            obstacles: [rightLane],
            coins: [leftLane, middleLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 30
    },

    {
        id: 35,
        pattern: {
            obstacles: [leftLane],
            coins: [middleLane, rightLane],
            ramps: [],
            slideObstacles: [middleLane],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 36,
        pattern: {
            obstacles: [middleLane],
            coins: [leftLane, rightLane],
            ramps: [],
            slideObstacles: [leftLane],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 37,
        pattern: {
            obstacles: [rightLane],
            coins: [leftLane, middleLane],
            ramps: [],
            slideObstacles: [rightLane],
            jumpObstacles: []
        },
        weight: 30
    },

    {
        id: 38,
        pattern: {
            obstacles: [leftLane],
            coins: [middleLane, rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: [middleLane]
        },
        weight: 30
    },
    {
        id: 39,
        pattern: {
            obstacles: [middleLane],
            coins: [leftLane, rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: [leftLane]
        },
        weight: 30
    },
    {
        id: 40,
        pattern: {
            obstacles: [rightLane],
            coins: [leftLane, middleLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: [rightLane]
        },
        weight: 30
    },

    {
        id: 41,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 42,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [middleLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 43,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [leftLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },

    {
        id: 44,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [rightLane],
            ramps: [],
            slideObstacles: [rightLane],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 45,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [middleLane],
            ramps: [],
            slideObstacles: [middleLane],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 46,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [leftLane],
            ramps: [],
            slideObstacles: [leftLane],
            jumpObstacles: []
        },
        weight: 40
    },

    {
        id: 47,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: [rightLane]
        },
        weight: 40
    },
    {
        id: 48,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [middleLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: [middleLane]
        },
        weight: 40
    },
    {
        id: 49,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [leftLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: [leftLane]
        },
        weight: 40
    },

    {
        id: 50,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [rightLane],
            ramps: [rightLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 51,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [middleLane],
            ramps: [middleLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },
    {
        id: 52,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [leftLane],
            ramps: [leftLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 40
    },

    {
        id: 53,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [],
            ramps: [rightLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 54,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [],
            ramps: [middleLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 30
    },
    {
        id: 55,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [],
            ramps: [leftLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 30
    },

    {
        id: 56,
        pattern: {obstacles: [leftLane], coins: [leftLane], ramps: [], slideObstacles: [], jumpObstacles: []},
        weight: 20
    },
    {
        id: 57,
        pattern: {obstacles: [middleLane], coins: [middleLane], ramps: [], slideObstacles: [], jumpObstacles: []},
        weight: 20
    },
    {
        id: 58,
        pattern: {obstacles: [rightLane], coins: [rightLane], ramps: [], slideObstacles: [], jumpObstacles: []},
        weight: 20
    },

    {
        id: 59,
        pattern: {
            obstacles: [leftLane, middleLane],
            coins: [leftLane, middleLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 500
    },
    {
        id: 60,
        pattern: {
            obstacles: [leftLane, rightLane],
            coins: [leftLane, rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 500
    },
    {
        id: 61,
        pattern: {
            obstacles: [middleLane, rightLane],
            coins: [middleLane, rightLane],
            ramps: [],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 500
    },

    {
        id: 62,
        pattern: {
            obstacles: [leftLane, middleLane, rightLane],
            coins: [leftLane, middleLane, rightLane],
            ramps: [leftLane, middleLane, rightLane],
            slideObstacles: [],
            jumpObstacles: []
        },
        weight: 600
    },

];