import React, { Component } from 'react';

const ssUrl = require('./../art/spritesheet.png');
const spriteSheet = new Image();
spriteSheet.src = ssUrl;

class GameCanvas extends Component {
   constructor() {
      super();
   }

   componentDidMount = () => {
      this.canvas = this.refs.g_canvas;
      this.ctx = this.canvas.getContext('2d');

      this.gridHash = this._initGrid({ rows: 12, cols: 16, t_width: 800, t_height: 600 });

      this.canvas.addEventListener('click', e => {
         let gCoords = { x: Math.ceil((e.clientX - 240) / 50), y: Math.ceil((e.clientY - 212) / 50) };
         let gridKey = `${gCoords.x}-${gCoords.y}`;
         console.log(`Clicked on grid tile ${gridKey}`);
      })

      this._renderLoop();
   }

   _renderLoop = () => {
      this._drawRender();
      window.requestAnimationFrame(this._renderLoop);
   }

   _drawRender = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this._drawGrid();
   }

   _drawBox = (type, box) => {
      if (!box) return;

      if (type === 'grid') {
         this.ctx.fillRect(box.x, box.y, box.width, box.height);
         this.ctx.drawImage(spriteSheet, box.sprite.x, box.sprite.y, box.sprite.width, box.sprite.height, box.x, box.y, box.width, box.height);
      } else {
         this.ctx.fillStyle = box.color;
         this.ctx.fillRect(box.x, box.y, box.width, box.height);
      }
   }

   _drawGrid = () => { for (let coords in this.gridHash) this._drawBox('grid', this.gridHash[coords]) }

   _initGrid = ({ rows, cols, t_width, t_height }) => {
      let width = t_width / cols;
      let height = t_height / rows;
      let gridHash = {};

      for (let i = 0; i <= rows; i++) {
         for (let j = 0; j <= cols; j++) {
            let key = `${i}-${j}`,
               gX = i, gY = j,
               x = (j * width),
               y = (i * height),
               gridTypeConfig = grid.gridTypes[grid._getRandomConstant()];

            let el = document.createElement('area');
            el.coords = `${x},${x + 50},${y},${y + 50}`
            el.href = 'Javascript:console.log("whaaa")';
            document.body.append(el);

            gridHash[key] = new this.GameClasses.GridBox({ gX, gY, x, y, width, height, ...gridTypeConfig })
         }
      }
      console.log(gridHash)
      return gridHash;
   }

   GameClasses = (() => ({
      GridBox: function GridBox({ gX, gY, x, y, width, height, type, passable, friction, damage, color, sprite }) {
         this.gX = gX;
         this.gY = gY;
         this.x = x || 0;
         this.y = y || 0;
         this.width = width || 0;
         this.height = height || 0;

         this.type = type;
         this.passable = passable;
         this.friction = friction;
         this.damage = damage;
         this.color = color;
         this.sprite = sprite;
      },
      CharBox: function CharBox({ x, y, width, height, type, color, sprite }) {
         this.x = x || 0;
         this.y = y || 0;
         this.width = width || 0;
         this.height = height || 0;

         this.type = type;
         this.color = color;
         this.sprit = sprite;
      }
   }))()

   render() {
      return (<>
         <canvas
            id="g_canvas"
            ref="g_canvas"
            width="800"
            height="600"
         />
      </>);
   }
}

const randomHex = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
const randInt = n => (Math.floor(Math.random() * n) + 1);

const grid = {
   _getRandomConstant: () => ([0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0][(Math.floor(Math.random() * (20 - 1)) + 1)]),
   gridTypes: {
      0: {
         type: 'walkable',
         const: 0,
         passable: true,
         friction: 0,
         damage: 0,
         color: '#d2d2d2',
         sprite: [{ x: 0, y: 0, width: 50, height: 50, type: 0 }, { x: 0, y: 50, width: 50, height: 50, type: 0 }, { x: 0, y: 100, width: 50, height: 50, type: 0 }][randInt(3) - 1]
      },
      1: {
         type: 'walkableSlow',
         const: 1,
         passable: true,
         friction: Number((Math.random() * (.8 - .3) + .3).toFixed(2)),
         damage: 0,
         color: '#80cccc',
         sprite: [{ x: 100, y: 0, width: 50, height: 50, type: 1 }, { x: 100, y: 50, width: 50, height: 50, type: 1 }, { x: 100, y: 100, width: 50, height: 50, type: 1 }][randInt(3) - 1]
      },
      2: {
         type: 'blocked',
         const: 2,
         passable: false,
         friction: 0,
         damage: 0,
         color: '#7a7a7a',
         sprite: [{ x: 50, y: 0, width: 50, height: 50, type: 2 }, { x: 50, y: 50, width: 50, height: 50, type: 2 }, { x: 50, y: 100, width: 50, height: 50, type: 2 }][randInt(3) - 1]
      },
      3: {
         type: 'damage',
         passable: true,
         const: 3,
         friction: Number((Math.random() * (.8 - .3) + .3).toFixed(2)),
         damage: Number((Math.random() * (.75 - .25) + .25).toFixed(2)),
         color: '#c4341b',
         sprite: [{ x: 150, y: 0, width: 50, height: 50, type: 3 }, { x: 150, y: 50, width: 50, height: 50, type: 3 }, { x: 150, y: 100, width: 50, height: 50, type: 3 }][randInt(3) - 1]
      }
   }
}

export default GameCanvas;

let levelSprites = {
   walkable: { zones: [{ x: 0, y: 0, width: 50, height: 50, type: 0 }, { x: 0, y: 50, width: 50, height: 50, type: 0 }, { x: 0, y: 100, width: 50, height: 50, type: 0 }] },
   walkableSlow: { zones: [{ x: 100, y: 0, width: 50, height: 50, type: 2, slow: 0.25 }, { x: 100, y: 50, width: 50, height: 50, type: 2, slow: 0.50 }, { x: 100, y: 100, width: 50, height: 50, type: 2, slow: 0.75 }] },
   blocked: { zones: [{ x: 50, y: 0, width: 50, height: 50, type: 1 }, { x: 50, y: 50, width: 50, height: 50, type: 1 }, { x: 50, y: 100, width: 50, height: 50, type: 1 }] },
   damage: { zones: [{ x: 200, y: 0, width: 50, height: 50, type: 4, slow: 0.75, damage: 0.25 }, { x: 200, y: 50, width: 50, height: 50, slow: 0.35, damage: 0.50, type: 4 }, { x: 200, y: 100, width: 50, height: 50, slow: 0.55, damage: 0.75, type: 4 }] }
}

let hero = { down: { x: 0, y: 0, width: 56, height: 72 }, up: { x: 0, y: 74, width: 53, height: 72 }, left: { x: 0, y: 146, width: 53, height: 72 }, right: { x: 0, y: 219, width: 53, height: 72 } }