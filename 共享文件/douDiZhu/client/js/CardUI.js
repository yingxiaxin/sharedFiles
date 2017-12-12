// import CardMapping from './CardMapping';

class CardUI
{
    constructor(num, type, parentCon)
    {
        this.cardNum = num;
        this.cardType = type;
        this.parentContainer = parentCon;

        this.selected = false;  //这张牌是否被选中

        this.color = CardMapping.typeMap.get(type).color;
        this.flower = CardMapping.typeMap.get(type).code;

        //纸牌的最外层容器
        let instanceDiv = document.createElement('div');
        instanceDiv.style.position = 'absolute';
        instanceDiv.style.cursor = 'pointer';
        instanceDiv.style.userSelect = 'none';

        //纸牌左上角的数字
        let numTag1 = document.createElement('span');
        numTag1.innerText = this.cardNum;
        numTag1.style.position = 'absolute';
        numTag1.style.top = '8%';
        numTag1.style.left = '10%';
        numTag1.style.color = this.color;

        //纸牌右下角的数字
        let numTag2 = document.createElement('span');
        numTag2.innerText = this.cardNum;
        numTag2.style.position = 'absolute';
        numTag2.style.bottom = '8%';
        numTag2.style.right = '10%';
        numTag2.style.transform = 'rotate(180deg)';
        numTag2.style.color = this.color;

        //纸牌左上角的花色
        let typeTag1 = document.createElement('span');
        typeTag1.innerHTML = this.flower;
        typeTag1.style.position = 'absolute';
        typeTag1.style.top = '18%';
        typeTag1.style.left = '10%';
        typeTag1.style.color = this.color;

        //纸牌右下角的花色
        let typeTag2 = document.createElement('span');
        typeTag2.innerHTML = this.flower;
        typeTag2.style.position = 'absolute';
        typeTag2.style.bottom = '18%';
        typeTag2.style.right = '10%';
        typeTag2.style.transform = 'rotate(180deg)';
        typeTag2.style.color = this.color;

        //纸牌中间的花色
        let midTag = document.createElement('i');
        midTag.innerHTML = this.flower;
        midTag.style.position = 'absolute';
        midTag.style.top = '50%';
        midTag.style.left = '50%';
        midTag.style.transform = 'translate(-50%, -50%)';
        midTag.style.color = this.color;

        //将数字和花色符号加入纸牌容器
        instanceDiv.appendChild(numTag1);
        instanceDiv.appendChild(numTag2);

        instanceDiv.appendChild(typeTag1);
        instanceDiv.appendChild(typeTag2);

        instanceDiv.appendChild(midTag);
        
        instanceDiv.setAttribute('class', 'transparentContainer');

        if(this.parentContainer != null && typeof(this.parentContainer) != 'undefined')
        {
            this.parentContainer.appendChild(instanceDiv);
        }

        this.instance = instanceDiv;

        this.instance.onclick = ()=>{
            this.toggleSelected();
        };

        return this.instance;
    }

    toggleSelected()
    {
        if(this.selected == false)
        {
            this.instance.style.top = '10%;';
            this.selected = true;
        }
        else
        {
            this.instance.style.transform = 'translateY(0, 20px);';
            this.selected = false;
        }
    }
}

// export default CardUI;