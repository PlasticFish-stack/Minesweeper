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
    }//创建扫雷棋盘
    logic(e) {
        const {boomArray: boom, columnNum: column, rowNum: row} = e;
        const TargetTd = Array.from(document.getElementsByTagName('td'));
        let TargetBool = false;//为false才可以点击,如果为true则全部格子不能操作
        let Grid = column * row;//棋盘格子数量
        let Title = {
            win: "Game Clear",
            lose: "Game Over"
        };
        let dataProcessing = [];
        let data = [];
        for(let i = 0; i < Grid; i++){
            data[i] = i
        };
        let dataDeleteBoom = data.filter((num) => {
            return boom.indexOf(num) == -1
        });
        let flag = [];//旗帜数组,右击时会push进去格子的index值,如果flag内已经有该index值则不操作
        let boomNum = boom.length;//炸弹数组的长度
        const quantity = (index) => {
            if(typeof index != 'number' && index >= Grid){
                throw new Error('你是不是脑子有问题,quantity传td索引值进来才能用');
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
            if(typeof index != 'number' && index >= Grid ){
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
                if(boom.indexOf(index) == -1){
                    dataProcessing.push(index);
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
                        TargetTd[index].oncontextmenu = (e) => {
                            e.preventDefault();
                        }//去除index格子的右键默认点击事件
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
                return false
            };
        }//点击事件控制,传入td索引值递归周围格子
        TargetTd.forEach((item, index) => {
            item.addEventListener('click', (self) => {
                if(self.target.nodeName != 'TD'){
                    return false
                }//如果点击时不是td格子则return false，因为这个循环可能会循环到td内的img值,导致点击后会有个白框
                if(TargetBool == false){
                    if(flag.indexOf(index) != -1){
                        return false
                    }//如果是旗帜则不触发点击事件
                    if(boomSearch(index) == true){
                        let Lose = new Promise((res, rej) => {setTimeout(res, 1)});
                        boom.forEach((i) => {
                            const BoomIcon = document.createElement('img');
                            BoomIcon.setAttribute('src', './icon/boom.svg');
                            BoomIcon.setAttribute('class', 'icon');
                            if(TargetTd[i].childNodes.length != 0){
                                Array.from(TargetTd[i].childNodes).forEach((t) => {
                                    if(t.getAttribute('class') == 'flag'){
                                        const rightIcon = document.createElement('img');
                                        rightIcon.setAttribute('src', './icon/right.svg');
                                        rightIcon.setAttribute('class', 'right');
                                        TargetTd[i].appendChild(rightIcon);
                                    }
                                })//如果炸弹位置上已经有旗帜了则加入一个打勾(代表标对)的图标
                            }else{
                                TargetTd[i].appendChild(BoomIcon);
                            }
                        });
                        TargetTd.forEach((item, index) => {
                            if(boom.indexOf(index) == -1){
                                const falseIcon = document.createElement('img');
                                falseIcon.setAttribute('src', './icon/false.svg');
                                falseIcon.setAttribute('class', 'false');
                                let TrText = originSearch(quantity(index)).origin.originNum;
                                let textNode = document.createElement('span');
                                let text = document.createTextNode(TrText);
                                textNode.appendChild(text);
                                textNode.setAttribute('class', 'num');
                                if(TrText != 0){
                                    if(item.childNodes.length != 0){
                                        Array.from(item.childNodes).forEach((t) => {
                                            if(t.nodeName == 'IMG'){
                                                console.log(t);
                                                if(t.getAttribute('class') == 'flag'){
                                                    t.style.opacity = '0';
                                                    item.appendChild(textNode);
                                                    falseIcon.style.opacity = '0.6';
                                                    item.appendChild(falseIcon);
                                                }
                                            }   
                                        })
                                    }else{
                                        item.innerText = TrText;
                                    }
                                }else{
                                    if(item.childNodes.length != 0){
                                        Array.from(item.childNodes).forEach((t) => {
                                            if(t.nodeName == 'IMG'){
                                                console.log(t);
                                                if(t.getAttribute('class') == 'flag'){
                                                    item.appendChild(falseIcon);
                                                }
                                            }   
                                        })
                                    };
                                }
                                item.setAttribute('class', 'Origin');
                            }
                        })
                        Lose.then((res) => {
                            setTimeout(() => {
                                TargetBool = true;
                                document.getElementById('winorlose').innerText = 'Lose'
                            }, 50)  
                        });//点击到炸弹时全体格子显示且无法再点击
                    }else{
                        let TrText = originSearch(quantity(index)).origin.originNum;
                        if(TrText != 0){
                            let TrText = originSearch(quantity(index)).origin.originNum;
                            self.target.setAttribute('class', 'Origin');
                            self.target.innerText = TrText;
                        }else{
                            operationLogic(index);
                        }//为0格时操作
                        if(dataProcessing.indexOf(index) == -1){
                            dataProcessing.push(index);
                        }
                        if(dataProcessing.sort((a,b)=>{return a>b?-1:a<b?1:0}).toString() == dataDeleteBoom.sort((a,b)=>{return a>b?-1:a<b?1:0}).toString()){
                            Array.from(TargetTd).forEach((n,m) => {
                                Array.from(TargetTd[m].childNodes).forEach((o, p)=>{
                                    console.log(TargetTd[m].childNodes);
                                    if(o.nodeName == 'IMG'){
                                        console.log(o);
                                        if(o.getAttribute('class') == 'flag'){
                                            const rightIcon = document.createElement('img');
                                            rightIcon.setAttribute('src', './icon/right.svg');
                                            rightIcon.setAttribute('class', 'right');
                                            TargetTd[m].appendChild(rightIcon);
                                        }
                                    }
                                    
                                })
                                
                            })
                            TargetBool = true;
                            document.getElementById('winorlose').innerText = 'Win'
                        }
                    }
                }else{
                    return
                }//点到炸弹了,TargetBool为true,取消click监听
            });
            item.oncontextmenu = (e) =>{
                e.preventDefault();
                if(TargetBool == false){
                    if(item.hasChildNodes() == false){
                        if(flag.length < boomNum){//flag数组如果超过炸弹数组数量则进入else直接return
                            if(flag.indexOf(index) == -1){//如果flag数组内没有点击格子的index值则给格子加入旗帜图标,并将格子index值加入flag数组内
                                const BoomIcon = document.createElement('img');
                                BoomIcon.setAttribute('src', './icon/flag.svg');
                                BoomIcon.setAttribute('class', 'flag');
                                e.target.appendChild(BoomIcon);
                                flag.push(index);
                            }else{
                                return
                            }
                        }else{
                            return
                        }
                    }else{
                        if(flag.indexOf(index) != -1){
                            Array.from(item.childNodes).forEach((i) => {
                                i.remove();
                            });
                            let clearFlag = flag.findIndex((val) => {return val == index});
                            flag.splice(clearFlag,1);
                        }
                    }
                }else{
                    return false
                }
                if(flag.sort((a,b)=>{return a>b?-1:a<b?1:0}).toString() == boom.sort((a,b)=>{return a>b?-1:a<b?1:0}).toString()){
                    TargetBool = true;
                    Array.from(TargetTd).forEach((n,m) => {
                        Array.from(TargetTd[m].childNodes).forEach((o, p)=>{
                            console.log(TargetTd[m].childNodes);
                            if(o.nodeName == 'IMG'){
                                console.log(o);
                                if(o.getAttribute('class') == 'flag'){
                                    const rightIcon = document.createElement('img');
                                    rightIcon.setAttribute('src', './icon/right.svg');
                                    rightIcon.setAttribute('class', 'right');
                                    TargetTd[m].appendChild(rightIcon);
                                }
                            }
                            
                        })
                        
                    })
                    document.getElementById('winorlose').innerText = 'Win'
                }
            };//右键生成旗帜,如果旗帜数量等于炸弹数量则不再触发
        });
    }
}
document.getElementById('Target').style.display = "none"; //因为技术力原因隐藏Table
document.getElementById('Target').oncontextmenu = (e) => {
    e.preventDefault()
};//取消Table内边框等位置的浏览器右键事件
document.getElementsByClassName('icon').oncontextmenu = (e) => {
    e.preventDefault()
}
function createMine(num, num_, boom) {
    console.clear();
    document.getElementById('winorlose').innerText = '？'
    document.getElementById('Target').style.display = '';//因为技术力原因不知道怎么把没内容但是边框特别粗的table隐藏，所以这里可以点击生成后取消隐藏Table
    let i = new Mineweeper(num, num_, boom); 
}//新建扫雷实例