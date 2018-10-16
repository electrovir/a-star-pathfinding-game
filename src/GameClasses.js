export default ({ game, utils }) => ({
   GridBox: function GridBox({ key, gX, gY, x, y, width, height, type, passable, friction, damage, color, sprite }) {
      this.key = key;
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
      this.origSprite = Object.assign({}, sprite);

      this.gScore = 0;
      this.hScore = 0;
      this.fScore = 0;

      this.parentZone = {};
      this._setParent = box => this.parentZone = box;
      this._clearParent = () => this.parentZone = null;

      this.isSelected = false;
      this._select = () => this.isSelected = true;
      this._deselect = () => this.isSelected = false;

      this.isSource = false;
      this._setSource = () => {
         this.isSource = true;
         this.sprite = { x: 0, y: 50, width: 50, height: 50, type: 0 };
      }
      this._clearSource = () => {
         this.isSource = false;
         this.sprite = this.origSprite;
         delete game.heroPosition;
      }

      this.isDestination = false;
      this._setDestination = () => {
         this.isDestination = true;
         this.sprite = { x: 0, y: 100, width: 50, height: 50, type: 0 };
      }
      this._clearDestination = () => {
         this.isDestination = false;
         this.sprite = this.origSprite;
         delete game.heroDestination;
      }

      this._setNearestState = () => !this.isDestination ? this.sprite = { x: 0, y: 150, width: 50, height: 50, type: 0 } : null;
      this._setNeighborState = () => !this.isDestination ? this.sprite = { x: 0, y: 200, width: 50, height: 50, type: 0 } : null;
      this._getNeighbors = () => {
         let { gX, gY } = this;
         let neighbors = [];
         let nPosition = 0;
         
         for (let i = gX - 1; i <= gX + 1; i++) {
            for (let j = gY - 1; j <= gY + 1; j++) {
               if ((i < 0 || j < 0 || i > 15 || j > 11) || (i === this.gX && j === this.gY)) { nPosition++; continue; }
               else {
                  if (nPosition === 0 || nPosition === 2 || nPosition === 6 || nPosition === 8) { nPosition++; continue; };
                  let neighbor = game.gridHash[`${i}-${j}`];
                  neighbor.direction = utils.nDirections[nPosition]
                  neighbors.push(neighbor);
                  nPosition++;
               }
            }
         }
         return neighbors
      }
   },
   CharBox: function CharBox({ x, y, width, height, type, color, sprite, spriteSet }) {
      this.x = x || 0;
      this.y = y || 0;
      this.width = width || 0;
      this.height = height || 0;

      this.type = type;
      this.color = color || 'rgba(255,255,255,0)';
      this.sprite = sprite;
      this.spriteSet = spriteSet;

      this._setDirection = dir => {
         let transDir = { NORTH: 'up', SOUTH: 'down', EAST: 'right', WEST: 'left' };
         this.sprite = this.spriteSet[transDir[dir || 'SOUTH']];
      }
   }
})