const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');

const dice = [
  {
    value: 1,
    face: "&#x2680;",
  },
  {
    value: 2,
    face: "&#x2681;",
  },
  {
    value: 3,
    face: "&#x2682;",
  },
  {
    value: 4,
    face: "&#x2683;",
  },
  {
    value: 5,
    face: "&#x2684;",
  },
  {
    value: 6,
    face: "&#x2685;",
  }
];

let rolls = 0;
let round = 1;
let heldDice = [];
let diceToThrow = [];
let scoreChosen;
let scores = [
  {
    value: 1,
    type: 'ones',
    score: 0
  },
  {
    value: 2,
    type: 'twos',
    score: 0
  },
  {
    value: 3,
    type: 'threes',
    score: 0
  },
  {
    value: 4,
    type: 'fours',
    score: 0
  },
  {
    value: 5,
    type: 'fives',
    score: 0
  },
  {
    value: 6,
    type: 'sixes',
    score: 0
  },
]



const rollDice = (numberOfDice, newGame) => {
  if (rolls < 3) {
    diceToThrow = [];
    for (i = 0; i < numberOfDice; i++) {
      const index = Math.floor(Math.random() * 6);
      diceToThrow.push(dice[index]);
    }
    if (!newGame) ++rolls
  }
};

const clickableDice = () => 
  diceToThrow.map((d, index) => 
   `<a href="/hold-dice/${index}" style="text-decoration: none;">${d.face}</a>`
  ).join(' ');

const gameOver = () => round === 7 ? scores.map((s) => s.score).reduce((a, b) => a + b, 0) : '';

const finished = () => round === 7 ? 'Game Over' : 'Yahtzee';

const startNewGame = () => round === 7 ? `<a href="/new-game-board"><button style="height: 100px; width: 100px">New Game</button></a>` : '';

const clickableHeldDice = () => 
heldDice.map((d, index) => 
  `<a href="/release-dice/${index}" style="text-decoration: none;">${d.face}</a>`
).join(' ');

const chooseCombo = (combo) => {
  scoreChosen = scores.find((s) => s.type === combo);
};

const calculateScore = (finalDice) => {
  const matches = finalDice.filter((d) => scoreChosen.value === d.value);
  scoreChosen.score = matches.length > 1 ? scoreChosen.value * matches.length : 0;
}




const gameBoard = {
  new_game: (ctx) => {
    rolls = 0;
    round = 1;
    heldDice = [];
    diceToThrow = [];
    scoreChosen;
    scores = [
      {
        value: 1,
        type: 'ones',
        score: 0
      },
      {
        value: 2,
        type: 'twos',
        score: 0
      },
      {
        value: 3,
        type: 'threes',
        score: 0
      },
      {
        value: 4,
        type: 'fours',
        score: 0
      },
      {
        value: 5,
        type: 'fives',
        score: 0
      },
      {
        value: 6,
        type: 'sixes',
        score: 0
      },
    ];
    rollDice(5, true);
    ctx.body = `
    <style>
      td {
        border: black 2px solid;
      }
      table {
        background-color: beige;
        float: right;
        margin-right: 100px;
      }
    </style>
    <div style="background-color: green; height: 75vh; width: 90vw; margin: 40px; border-radius: 20px; text-align: center;">
      <h1 style="color: white; font-size: 150px;">🎲 Game Board 🎲</h1>
      <div>
        <table id="table">
          <tr>
            <td>Type</td>
            <td>Your Score</td>
          </tr>
          <tr>
            <td>Ones</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Twos</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Threes</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Fours</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Fives</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Sixes</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Grand Total</td>
            <td>--<td>
          </tr>
        </table>
      </div>
      <div>
        <div id="dice" style="font-size: 140px; display: inline;">${diceToThrow.map((d) => d.face).join(' ')}</div>
      </div>
      <a href="/game-board/roll-${diceToThrow.length}"><button>Roll</button></a>

    </div>`
  }, 
  current_game: (ctx) => {
      ctx.body = `
      <style>
        td {
          border: black 2px solid;
        }
        table {
          background-color: beige;
          float: right;
          margin-right: 100px;
        }
      </style>
      <div style="background-color: green; height: 75vh; width: 90vw; margin: 40px; border-radius: 20px; text-align: center;">
        <h1 style="color: white; font-size: 150px;">🎲 ${finished()} 🎲</h1>
        <div>${startNewGame()}</div>
        <div>
          <table id="table">
          <h3 style="color: white; float: right; margin-right: 100px;">Rounds ${round}/7</h3>
            <tr>
              <td>Type</td>
              <td>Your Score</td>
            </tr>
            <tr>
              <td><a href="/submit-move/ones">Ones</a></td>
              <td>${scores.find((s) => s.type === 'ones').score}</td>
            </tr>
            <tr>
              <td><a href="/submit-move/twos">Twos</a></td>
              <td>${scores.find((s) => s.type === 'twos').score}</td>
            </tr>
            <tr>
              <td><a href="/submit-move/threes">Threes</a></td>
              <td>${scores.find((s) => s.type === 'threes').score}</td>
            </tr>
            <tr>
              <td><a href="/submit-move/fours">Fours</a></td>
              <td>${scores.find((s) => s.type === 'fours').score}</td>
            </tr>
            <tr>
              <td><a href="/submit-move/fives">Fives</a></td>
              <td>${scores.find((s) => s.type === 'fives').score}</td>
            </tr>
            <tr>
              <td><a href="/submit-move/sixes">Sixes</a></td>
              <td>${scores.find((s) => s.type === 'sixes').score}</td>
            </tr>
            <tr>
              <td>Grand Total</td>
              <td>${gameOver()}<td>
            </tr>
          </table>
        </div>
        <div id="throwing-dice">
          <div id="dice" style="font-size: 140px; display: inline;">${clickableDice()}</div>
        </div>
        <a href="/game-board/roll-${diceToThrow.length}"><button>Roll</button></a>
        <div id="kept-dice">
          <div id="dice" style="font-size: 140px; display: inline;">${clickableHeldDice()}</div>
        </div>

      </div>`
  }
};

app.use(route.get('/', async function (ctx) {
  ctx.body = `
  <head>
    <script src="app.js"></script>
  </head>
  <body>
    <div style="background-color: green; height: 75vh; width: 90vw; margin: 40px; border-radius: 20px; text-align: center;">
      <h1 style="color: white; font-size: 150px;">🎲 Yahtzee 🎲</h1>
      <a href="/new-game-board"><button style="height: 150px; width: 200px; font-size: 50px; border-radius: 20px;">Start Game</button></a>
    </div>
  </body>`
}));

app.use(route.get('/new-game-board', gameBoard.new_game));
app.use(route.get('/game-board', gameBoard.current_game));
app.use(route.get('/game-board/:move', async function (ctx) {
  rollDice(diceToThrow.length, false);
  ctx.redirect('/game-board');
}));
app.use(route.get('/hold-dice', gameBoard.current_game));
app.use(route.get('/release-dice', gameBoard.current_game));
app.use(route.get('/hold-dice/:index', async function (ctx, index) {
  heldDice.push(diceToThrow[index]);
  diceToThrow.splice(index, 1);
  ctx.redirect('/hold-dice');
}));
app.use(route.get('/release-dice/:index', async function (ctx, index) {
  diceToThrow.push(heldDice[index]);
  heldDice.splice(index, 1);
  ctx.redirect('/hold-dice');
}));
app.use(route.get('/submit-move/:combo', async function (ctx, combo) {
  scoreChosen = scores.find((s) => s.type === combo);
  const finalDice = diceToThrow.concat(heldDice);
  const combos = finalDice.reduce(function(obj, item) {
    obj[item.value] = (obj[item.value] || 0) + 1;
    return obj;
  }, {});
  calculateScore(finalDice);
  if (round === 7) {
    ctx.redirect('/game-board');
  } else {
    ++round;
    rolls = 0;
    heldDice = [];
    rollDice(5);
    ctx.redirect('/game-board');
  }
}));




app.listen(3000);