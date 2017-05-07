const X_WIDTH: number = 12;
const Y_WIDTH: number = 12;

enum Arrow
{
    Up,
    Left,
    Down,
    Right,
    None
};

class Point
{
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    };
    public x: number;
    public y: number;
}

function Arrow2Point(arrow: Arrow): Point
{
    switch(arrow){
        case Arrow.Left:
            return new Point(-1, 0);
        case Arrow.Right:
            return new Point(1, 0);
        case Arrow.Up:
            return new Point(0, -1);
        case Arrow.Down:
            return new Point(0, 1);
        default:
            return new Point(0, 0);
    }
}

class Snake
{
    constructor(){
        this.body = new Array<Point>();
        let xStart:number = Math.floor(Math.random()*(X_WIDTH-10)+5);
        let yStart:number = Math.floor(Math.random()*(Y_WIDTH-10)+5);
        this.direction = Math.floor(Math.random()*4);
        let dir: Point = Arrow2Point(this.direction);
        for(let i of [0,1,2])
            this.body.push(new Point(xStart-i*dir.x, yStart-i*dir.y));
        this.previousDirection = this.direction;
    }
    public body: Array<Point>;
    public direction: Arrow;
    public previousDirection: Arrow;
}

class GameTable{
    constructor(atable: HTMLTableElement)
    {
        this.HTMLtable = atable;
        this.snake = new Snake();
        this.table = new Array<Array<HTMLTableCellElement>>();
        for(let x : number = 0; x<X_WIDTH; x++)
        {
            let row: Array<HTMLTableCellElement> = new Array<HTMLTableCellElement>();
            let HTMLrow: HTMLTableRowElement = this.HTMLtable.insertRow(-1);
            for(let y : number = 0; y<Y_WIDTH; y++){
                let cell : HTMLTableCellElement = HTMLrow.insertCell(-1);
                row.push(cell);
            }
            this.table.push(row);
        }
        this.newApple();
        this.ClearHTMLTable();
    }
    private HTMLtable : HTMLTableElement;
    private snake: Snake;
    private apple: Point;
    public ClearHTMLTable(): void {
        for(let arr of this.table)
            for(let cell of arr)
                cell.className = "emptyBoard";
        this.table[this.apple.y][this.apple.x].className = "apple";
    }
    public table : Array<Array<HTMLTableCellElement>>;
    public drawSnake(): void{
        for(let point of this.snake.body)
            this.table[point.y][point.x].className = "snakeBody";
        this.table[this.snake.body[0].y][this.snake.body[0].x].className = "snakeHead";
    }
    public setDirection(arrow: Arrow)
    {
        let dir: Arrow = this.snake.previousDirection;
        if(
            (arrow === Arrow.Left && dir === Arrow.Right) ||
            (arrow === Arrow.Right && dir === Arrow.Left) ||
            (arrow === Arrow.Up && dir === Arrow.Down) ||
            (arrow === Arrow.Down && dir === Arrow.Up))
        {}
        else{
            this.snake.direction = arrow;
        }
    }
    public run():void{
        window.setTimeout(this.runFun,200);
    }
    public newApple() : void
    {
        let x: number = Math.floor(Math.random()*X_WIDTH);
        let y: number = Math.floor(Math.random()*Y_WIDTH);
        //temporary solution
        while(this.snake.body.some(p => p.x == x && p.y == y)){
            x = Math.floor(Math.random()*X_WIDTH);
            y = Math.floor(Math.random()*Y_WIDTH);
        }
        this.apple = new Point(x, y);
    }
    private runFun():void{
        let snake: Snake = gameTable.snake;
       let movement: Point = Arrow2Point(snake.direction);
       let head: Point = snake.body[0];
       let nextPoint: Point = new Point(head.x + movement.x, head.y + movement.y);
       if(nextPoint.x >= X_WIDTH || nextPoint.x < 0 || nextPoint.y >= Y_WIDTH || nextPoint.y < 0 || snake.body.slice(0,-1).some(p => p.x === nextPoint.x && p.y === nextPoint.y))
       {
            gameTable.snake = new Snake();
       }
       else
       {
           snake.body.splice(0, 0, nextPoint);
           if(nextPoint.x == gameTable.apple.x && nextPoint.y == gameTable.apple.y){
                gameTable.newApple();
           }
           else{
               snake.body.pop();
           }
       }
       snake.previousDirection = snake.direction;
       gameTable.ClearHTMLTable();
       gameTable.drawSnake();
       setTimeout(gameTable.runFun, Math.floor(600/Math.sqrt(snake.body.length)));
    }
}

let gameTable = new GameTable(<HTMLTableElement>document.getElementById("gameTable"));

document.addEventListener('keydown', (event)=>{
    const pressedKey: string = event.key;
    switch(pressedKey)
    {
    case "ArrowUp":
        gameTable.setDirection(Arrow.Up);
        break;
    case "ArrowDown":
        gameTable.setDirection(Arrow.Down);
        break;
    case "ArrowLeft":
        gameTable.setDirection(Arrow.Left);
        break;
    case "ArrowRight":
        gameTable.setDirection(Arrow.Right);
        break;
    default:
        break;
    }
});

let xInit: number = null;
let yInit: number = null;

document.addEventListener('touchstart', (event)=>{
    xInit = event.touches[0].clientX;
    yInit = event.touches[0].clientY;
},false);

document.addEventListener('touchmove', (event)=>{
    if(xInit === null || yInit === null)
        return;
    let xFinish: number = event.touches[0].clientX;
    let yFinish: number = event.touches[0].clientY;
    
    let xDiff: number = xFinish - xInit;
    let yDiff: number = yFinish - yInit;
    if(Math.abs(xDiff) > Math.abs(yDiff)){
        if(xDiff >  0)
            gameTable.setDirection(Arrow.Right);
        else
            gameTable.setDirection(Arrow.Left);
    }else{
        if(yDiff > 0)
            gameTable.setDirection(Arrow.Down);
        else
            gameTable.setDirection(Arrow.Up);
    }
}, false);

gameTable.run();

