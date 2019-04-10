class CardData {

}

CardData.data = [{ iconPos: '-1729px -100px', type: '0', val: 17 },
{ iconPos: '-1860px -100px', type: '0', val: 16 },
{ iconPos: '-35px -100px', type: '1', val: 14 },
{ iconPos: '-166px -100px', type: '1', val: 15 },
{ iconPos: '-297px -100px', type: '1', val: 3 },
{ iconPos: '-556px -100px', type: '1', val: 4 },
{ iconPos: '-687px -100px', type: '1', val: 5 },
{ iconPos: '-427px -100px', type: '1', val: 6 },
{ iconPos: '-817px -100px', type: '1', val: 7 },
{ iconPos: '-948px -100px', type: '1', val: 8 },
{ iconPos: '-1077px -100px', type: '1', val: 9 },
{ iconPos: '-1208px -100px', type: '1', val: 10 },
{ iconPos: '-1339px -100px', type: '1', val: 11 },
{ iconPos: '-1469px -100px', type: '1', val: 12 },
{ iconPos: '-1599px -100px', type: '1', val: 13 },
{ iconPos: '-35px -291px', type: '2', val: 14 },
{ iconPos: '-166px -291px', type: '2', val: 15 },
{ iconPos: '-297px -291px', type: '2', val: 3 },
{ iconPos: '-427px -291px', type: '2', val: 4 },
{ iconPos: '-556px -291px', type: '2', val: 5 },
{ iconPos: '-687px -291px', type: '2', val: 6 },
{ iconPos: '-817px -291px', type: '2', val: 7 },
{ iconPos: '-948px -291px', type: '2', val: 8 },
{ iconPos: '-1077px -291px', type: '2', val: 9 },
{ iconPos: '-1208px -291px', type: '2', val: 10 },
{ iconPos: '-1339px -291px', type: '2', val: 11 },
{ iconPos: '-1469px -291px', type: '2', val: 12 },
{ iconPos: '-1599px -291px', type: '2', val: 13 },
{ iconPos: '-35px -481px', type: '3', val: 14 },
{ iconPos: '-166px -481px', type: '3', val: 15 },
{ iconPos: '-297px -481px', type: '3', val: 3 },
{ iconPos: '-427px -481px', type: '3', val: 4 },
{ iconPos: '-556px -481px', type: '3', val: 5 },
{ iconPos: '-687px -481px', type: '3', val: 6 },
{ iconPos: '-817px -481px', type: '3', val: 7 },
{ iconPos: '-948px -481px', type: '3', val: 8 },
{ iconPos: '-1077px -481px', type: '3', val: 9 },
{ iconPos: '-1208px -481px', type: '3', val: 10 },
{ iconPos: '-1339px -481px', type: '3', val: 11 },
{ iconPos: '-1469px -481px', type: '3', val: 12 },
{ iconPos: '-1599px -481px', type: '3', val: 13 },
{ iconPos: '-35px -671px', type: '4', val: 14 },
{ iconPos: '-166px -671px', type: '4', val: 15 },
{ iconPos: '-297px -671px', type: '4', val: 3 },
{ iconPos: '-427px -671px', type: '4', val: 4 },
{ iconPos: '-556px -671px', type: '4', val: 5 },
{ iconPos: '-687px -671px', type: '4', val: 6 },
{ iconPos: '-817px -671px', type: '4', val: 7 },
{ iconPos: '-948px -671px', type: '4', val: 8 },
{ iconPos: '-1077px -671px', type: '4', val: 9 },
{ iconPos: '-1208px -671px', type: '4', val: 10 },
{ iconPos: '-1339px -671px', type: '4', val: 11 },
{ iconPos: '-1469px -671px', type: '4', val: 12 },
{ iconPos: '-1599px -671px', type: '4', val: 13 }];

CardData.getNewCard = function () {
    return CardData.data.slice(0);
}

CardData.getIconPos = function (type, val) {
    for (let dataItem of CardData.data) {
        if (dataItem.type == type && dataItem.val == val) {
            return dataItem.iconPos;
        }
    }
}

export default CardData;