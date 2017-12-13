class CardMapping
{

}

CardMapping.typeMap = new Map();
let hongtao = 
{
    color: 'palevioletred',
    code: '&#9829',
    index: '1'
};

let fangkuai = 
{
    color: 'orangered',
    code: '&#9830',
    index: '2'
};

let heitao = 
{
    color: 'black',
    code: '&#9824',
    index: '3'
};

let meihua = 
{
    color: 'grey',
    code: '&#9827',
    index: '4'
};

let wang = 
{
    color: 'green',
    code: '&#163',
    index: '0'
};

CardMapping.typeMap.set('1', hongtao);
CardMapping.typeMap.set('2', fangkuai);
CardMapping.typeMap.set('3', heitao);
CardMapping.typeMap.set('4', meihua);
CardMapping.typeMap.set('0', wang);
