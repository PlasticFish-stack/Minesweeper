document.getElementById('Target').style.display = "none";
document.getElementById('Target').oncontextmenu = (e) => {
    e.preventDefault()
};
class Mineweeper {
    constructor(columnNum, rowNum, boomNum) {
        this.logic(this.create(columnNum, rowNum, boomNum));
    }
    create(columnNum, rowNum, boomNum) {
        const boomArray = [];
        const TargetTdNum = (columnNum * rowNum);
        const TargetTable = document.getElementById('Target');//table元素
        let TargetTr = Array.from(document.getElementsByTagName('tr'));//table内tr元素
        for (let i = 0; i < boomNum; i++) {
            let Random = Math.floor(Math.random() * TargetTdNum);
            if(boomArray.indexOf(Random) == -1) {
                boomArray.push(Random);
            }else{
                i--
            }
        }//boomArray内加入boomNum数量的不重复随机数
        if (TargetTr.length != 0) {
            TargetTr.forEach((item,index) => {
                TargetTr[index].remove();
            })
            TargetTr = [];
        }//判断table内是否已有tr,如有则清空
        for (let column = 0; column < columnNum; column++) {
            let TargetRow = document.createElement('tr');
            for (let row = 0; row < rowNum; row++) {
                let TargetColumn = document.createElement('td');
                TargetColumn.setAttribute('class', 'TargetClass');
                TargetRow.appendChild(TargetColumn);
            }
            TargetTable.appendChild(TargetRow);
        }//添加columnNum行tr,在tr内加入rowNum个td;
        return {boomArray, columnNum, rowNum}
    }
    //创建扫雷棋盘
    logic(e) {
        const {boomArray: boom, columnNum: column, rowNum: row} = e;
        const TargetTd = Array.from(document.getElementsByTagName('td'));
        let TargetBool = false;
        let Grid = column * row;
        let TdLength = TargetTd.length;
        let Title = {
            win: "Game Clear",
            lose: "Game Over"
        };
        let dataProcessing = [];
        let flag = [];
        let boomNum = boom.length;
        
        const quantity = (index) => {
            if(typeof index != 'number'){
                throw new Error('你是不是脑子有问题.quantity传td索引值进来才能用');
            };
            const origin = {
                originNum: 0,
                originLeft: [0],
                originRight: [row - 1]
            };
            const { originLeft, originRight } = origin;
            const nineGrid = {
                topLeft: index - row - 1,
                top: index - row,
                topRight: index - row + 1,
                left: index - 1,
                right: index + 1,
                bottomLeft: index + row - 1,
                bottom: index + row,
                bottomRight: index + row + 1
            };
            const addArray = () => {
                for (let i = 0; i < column - 1; i++) {
                    originLeft.push(originLeft[i] + row);
                    originRight.push(originRight[i] + row);
                };
            };
            addArray();
            //判断格子是否最左或最右
            const operationGrid = () => {
                if (originLeft.includes(index)) {
                    nineGrid.topLeft = undefined;
                    nineGrid.left = undefined;
                    nineGrid.bottomLeft = undefined;
                }
                else if (originRight.includes(index)) {
                    nineGrid.topRight = undefined;
                    nineGrid.right = undefined;
                    nineGrid.bottomRight = undefined;
                }
                for (let item in nineGrid) {
                    if (nineGrid[item] < 0 || nineGrid[item] >= Grid) {
                        nineGrid[item] = undefined
                    }
                };
            };//判断是否最左或最右格,最上格与最下格,如果是则返回undefined
            operationGrid();
            return { origin, nineGrid , index}
        };//返回以index为中心的九宫格位置(index为Td索引值)
        const boomSearch = (index) => {
            if(typeof index != 'number'){
                throw new Error('你是不是脑子有问题,boomSearch传td索引值进来才能用');
            };
            let bool = false;
            if(boom.indexOf(index) == -1){
                return bool
            }else{
                bool = true;
                return bool
            }           
        };//判断index格子是不是炸弹,如果是返回true,如果不是返回false(index为Td索引值)
        const originSearch = (quantityObject) => {
            let { origin, nineGrid, item} = quantityObject;
            boom.forEach((i) => {
                for (let items in nineGrid) {
                    if (nineGrid[items] != 'undefined' && nineGrid[items] == i) {
                        origin.originNum++;
                    }
                };
            });
            return quantityObject
        };//传入计算之后的九宫格对象,输出对象里炸弹的数量,e.g:originSearch(quantity(index))
        const operationLogic = (i) => {
            let quantityObject = originSearch(quantity(i));
            let {origin, nineGrid, index} = quantityObject;
            const up = () =>{
                let topNum = nineGrid.top;
                if(typeof topNum == 'number'){
                    operationLogic(topNum);
                }
            };
            const left = () =>{
                let leftNum = nineGrid.left;
                if(typeof leftNum == 'number'){
                    operationLogic(leftNum);
                }
            };
            const right = () =>{
                let rightNum = nineGrid.right;
                if(typeof rightNum == 'number'){
                    operationLogic(rightNum);
                }
            };
            const bottom = () =>{
                let bottomNum = nineGrid.bottom;
                if(typeof bottomNum == 'number'){
                    operationLogic(bottomNum);
                }
            };
            const rightTop = () => {
                let rightTopNum = nineGrid.topRight;
                if(typeof rightTopNum == 'number'){
                    operationLogic(rightTopNum);
                }
            };
            const leftTop = () => {
                let leftTopNum = nineGrid.topLeft;
                if(typeof leftTopNum == 'number'){
                    operationLogic(leftTopNum);
                }
            };
            const rightBottom = () => {
                let rightBottomNum = nineGrid.bottomRight;
                if(typeof rightBottomNum == 'number'){
                    operationLogic(rightBottomNum);
                }
            };
            const leftBottom = () => {
                let leftBottomNum = nineGrid.bottomLeft;
                if(typeof leftBottomNum == 'number'){
                    operationLogic(leftBottomNum);
                }
            };
            if(dataProcessing.indexOf(index) == -1 && flag.indexOf(index) == -1){
                dataProcessing.push(index);
                if(boom.indexOf(index) == -1){
                    if(origin.originNum == 0){
                        TargetTd[index].setAttribute('class', 'Origin');
                        up();
                        left();
                        right();
                        bottom();
                        rightTop();
                        leftTop();
                        rightBottom();
                        leftBottom();
                    }else{
                        TargetTd[index].innerText = origin.originNum;
                        TargetTd[index].setAttribute('class', 'Origin');
                        return
                    }
                }else{
                    return
                }
                //已处理的格子加入数组,遍历时如果有格子index值直接return
            }else{
                return
            };
        }//点击事件控制,传入td索引值递归周围格子
        TargetTd.forEach((item, index) => {
            item.addEventListener('click', (self) => {
                if(TargetBool == false){
                    if(boomSearch(index) == true){
                        let Lose = new Promise((res, rej) => {setTimeout(res, 1)});
                        boom.forEach((i) => {
                            const BoomIcon = document.createElement('img');
                            BoomIcon.setAttribute('src', './bomb.svg');
                            BoomIcon.setAttribute('class', 'icon');
                            TargetTd[i].appendChild(BoomIcon);
                        });
                        TargetTd.forEach((item, index) => {
                            if(boom.indexOf(index) == -1){
                                let TrText = originSearch(quantity(index)).origin.originNum;
                                if(TrText != 0){
                                    item.innerText = TrText;
                                }
                                item.setAttribute('class', 'Origin');
                            }
                        })
                        Lose.then((res) => {
                            TargetBool = true;
                        });//点击到炸弹时全体格子显示且无法再点击
                    }else{
                        let TrText = originSearch(quantity(index)).origin.originNum;
                        if(TrText != 0){
                            let TrText = originSearch(quantity(index)).origin.originNum;
                            self.target.setAttribute('class', 'Origin');
                            self.target.innerText = TrText;
                        }else{
                            operationLogic(index);
                            console.log(dataProcessing);
                        }//为0格时操作
                    }
                }else{
                    return
                }//点到炸弹了,TargetBool为true,取消click监听           
            });
            item.oncontextmenu = (e) =>{
                e.preventDefault();
                if(flag.length < boomNum){
                    if(flag.indexOf(index) == -1){
                        const BoomIcon = document.createElement('img');
                        BoomIcon.setAttribute('src', './mark.svg');
                        BoomIcon.setAttribute('class', 'icon');
                        e.target.appendChild(BoomIcon);
                        flag.push(index);
                    }else{
                        return
                    }
                }else{
                    return
                }
                
                console.log(flag);
            };
        });
    }
}
function createMine(num, num_, boom) {
    console.clear();
    document.getElementById('Target').style.display = '';
    let i = new Mineweeper(num, num_, boom);
    console.log(i);
    
}//新建扫雷实例