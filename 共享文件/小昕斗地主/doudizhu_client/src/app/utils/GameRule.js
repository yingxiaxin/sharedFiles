class GameRule {
    /**
     * 牌型判断
     * @method function
     * @param  {[type]} cards [description]
     * @return {[type]}       [description]
     */
    static typeJudge(cards) {
        let len = cards.length;
        switch (len) {
            case 1: {
                return { 'cardKind': GameRule.ONE, 'val': cards[0].val, 'size': len };
            }
            case 2: {
                if (GameRule.isPairs(cards)) {
                    return { 'cardKind': GameRule.PAIRS, 'val': cards[0].val, 'size': len };
                }
                else if (GameRule.isKingBomb(cards)) {
                    return { 'cardKind': GameRule.KING_BOMB, 'val': cards[0].val, 'size': len };
                }
                else {
                    return null;
                }
            }
            case 3: {
                if (GameRule.isThree(cards)) {
                    return { 'cardKind': GameRule.THREE, 'val': cards[0].val, 'size': len };
                }
                else {
                    return null;
                }
            }
            case 4: {
                if (GameRule.isThreeWithOne(cards)) {
                    return { 'cardKind': GameRule.THREE_WITH_ONE, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                }
                else if (GameRule.isBomb(cards)) {
                    return { 'cardKind': GameRule.BOMB, 'val': cards[0].val, 'size': len };
                }
                else {
                    return null;
                }
            }
            default: {
                if (GameRule.isProgression(cards)) {
                    return { 'cardKind': GameRule.PROGRESSION, 'val': cards[0].val, 'size': len };
                }
                else if (GameRule.isProgressionPairs(cards)) {
                    return { 'cardKind': GameRule.PROGRESSION_PAIRS, 'val': cards[0].val, 'size': len };
                }
                else if (GameRule.isThreeWithPairs(cards)) {
                    return { 'cardKind': GameRule.THREE_WITH_PAIRS, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                }
                else if (GameRule.isPlane(cards)) {
                    return { 'cardKind': GameRule.PLANE, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                }
                else if (GameRule.isPlaneWithOne(cards)) {
                    return { 'cardKind': GameRule.PLANE_WITH_ONE, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                }
                else if (GameRule.isPlaneWithPairs(cards)) {
                    return { 'cardKind': GameRule.PLANE_WITH_PAIRS, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                }
                else if (GameRule.isFourWithTwo(cards)) {
                    return { 'cardKind': GameRule.FOUR_WITH_TWO, 'val': GameRule.getMaxVal(cards, 4), 'size': len };
                }
                else if (GameRule.isFourWithPairs(cards)) {
                    return { 'cardKind': GameRule.FOUR_WITH_TWO_PAIRS, 'val': GameRule.getMaxVal(cards, 4), 'size': len };
                }
                else {
                    return null;
                }
            }
        }
    }

    //是否是对子
    static isPairs(cards) {
        return cards.length == 2 && cards[0].val === cards[1].val;
    }

    //是否是三根
    static isThree(cards) {
        return cards.length == 3 && cards[0].val === cards[1].val && cards[1].val === cards[2].val;
    }

    //是否是三带一
    static isThreeWithOne(cards) {
        if (cards.length != 4) {
            return false;
        }
        let m = GameRule.valCount(cards);
        let array = [...m.values()];
        return m.size === 2 && (array[0] === 3 || array[0] === 3);
    }

    //是否是三带一对
    static isThreeWithPairs(cards) {
        if (cards.length != 5) {
            return false;
        }
        let m = GameRule.valCount(cards);
        let array = [...m.values()];
        return m.size === 2 && (array[0] === 3 || array[1] === 3);
    }

    //是否是顺子
    static isProgression(cards) {
        if (cards.length < 5 || cards[0].val === 15) {
            return false;
        }
        for (let i = 0; i < cards.length; i++) {
            if (i != (cards.length - 1) && (cards[i].val - 1) != cards[i + 1].val) {
                return false;
            }
        }
        return true;
    }

    //是否是连对
    static isProgressionPairs(cards) {
        if (cards.length < 6 || cards.length % 2 != 0 || cards[0].val === 15) {
            return false;
        }
        for (let i = 0; i < cards.length; i = i + 2) {
            if (i != (cards.length - 2) && (cards[i].val != cards[i + 1].val || (cards[i].val - 1) != cards[i + 2].val)) {
                return false;
            }
        }
        return true;
    }

    //是否是飞机
    static isPlane(cards) {
        if (cards.length < 6 || cards.length % 3 != 0 || cards[0].val === 15) {
            return false;
        }
        for (let i = 0; i < cards.length; i = i + 3) {
            if (i != (cards.length - 3) && (cards[i].val != cards[i + 1].val || cards[i].val != cards[i + 2].val || (cards[i].val - 1) != cards[i + 3].val)) {
                return false;
            }
        }
        return true;
    }

    //是否是飞机带单
    static isPlaneWithOne(cards) {
        if (cards.length < 8 || cards.length % 4 != 0) {
            return false;
        }

        let m = GameRule.valCount(cards),
            threeList = [],
            threeCount = cards.length / 4;
        for (let [key, value] of m.entries()) {
            if (value == 3) {
                threeList.push({ 'val': key, 'count': value });
            }
        }

        if (threeList.length != threeCount || threeList[0].val === 15) {
            //检测三根数量和不能为2
            return false;
        }

        for (let i = 0; i < threeList.length; i++) {
            //检测三根是否连续
            if (i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val) {
                return false;
            }
        }
        return true;
    }

    //是否是飞机带对
    static isPlaneWithPairs(cards) {
        if (cards.length < 10 || cards.length % 5 != 0) {
            return false;
        }

        let m = GameRule.valCount(cards),
            threeList = [],
            pairsList = [],
            groupCount = cards.length / 5;
        for (let [key, value] of m.entries()) {
            if (value == 3) {
                threeList.push({ 'val': key, 'count': value });
            }
            else if (value == 2) {
                pairsList.push({ 'val': key, 'count': value });
            }
            else {
                return false;
            }
        }

        if (threeList.length != groupCount || pairsList.length != groupCount || threeList[0].val === 15) {
            //检测三根数量和对子数量和不能为2
            return false;
        }

        for (let i = 0; i < threeList.length; i++) {
            //检测三根是否连续
            if (i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val) {
                return false;
            }
        }
        return true;
    }

    //是否是四带二
    static isFourWithTwo(cards) {
        let m = GameRule.valCount(cards);
        if (cards.length != 6 || m.size > 3) {
            return false;
        }
        for (let value of m.values()) {
            if (value === 4) {
                return true;
            }
        }
        return false;
    }


    //是否是四带两个对
    static isFourWithPairs(cards) {
        if (cards.length != 8) {
            return false;
        }

        let m = GameRule.valCount(cards);
        if (m.size != 3) {
            return false;
        }

        for (let value of m.values()) {
            if (value != 4 && value != 2) {
                return false;
            }
        }
        return true;
    }

    //是否是炸弹
    static isBomb(cards) {
        return cards.length === 4 && cards[0].val === cards[1].val && cards[0].val === cards[2].val && cards[0].val === cards[3].val;
    }

    //是否是王炸
    static isKingBomb(cards) {
        return cards.length === 2 && cards[0].type == '0' && cards[1].type == '0';
    }

    /**
     * 获取min到max之间的随机整数，min和max值都取得到
     * @param {*} min 
     * @param {*} max 
     */
    static random(min, max) {
        min = min == null ? 0 : min;
        max = max == null ? 1 : max;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * 牌统计，统计各个牌有多少张，比如2张A，一张8
     * @param {*} cards 
     */
    static valCount(cards) {
        let resultMap = new Map();

        let addCount = function (rstMap, v) {
            if (rstMap.has(v) == true) {
                let cnt = rstMap.get(v);
                cnt = cnt + 1;
                rstMap.set(v, cnt);
            }
            else {
                rstMap.set(v, 1);
            }
        };

        for (let i = 0; i < cards.length; i++) {
            addCount(resultMap, cards[i].val);
        }

        return resultMap;
    }

    /**
     * 获取指定张数的最大牌值
     * @param {*} cards 
     * @param {*} n 
     */
    static getMaxVal(cards, n) {
        let map = GameRule.valCount(cards);
        let max = 0;

        for (let [key, value] of map.entries()) {
            if (value === n && key > max) {
                max = key;
            }
        }

        return max;
    }

    /**
     * 卡牌排序.
     * @param {*} a 
     * @param {*} b 
     */
    static cardSort(a, b) {
        let va = Number.parseInt(a.val);
        let vb = Number.parseInt(b.val);
        if (va === vb) {
            return a.type > b.type ? 1 : -1;
        }
        else if (va > vb) {
            return -1;
        }
        else {
            return 1;
        }
    }

    /**
     * 判断出牌是否合规
     */
    static judgeDealRule(lastData, thisData, mainPlayerId, lastDealerId) {
        let thisDeal = GameRule.typeJudge(thisData);
        let lastDeal = GameRule.typeJudge(lastData);

        // lastDeal为空即没有上次出牌数据，说明是本局游戏第一位出牌的
        // 而且如果本次出牌不为null，说明本次出牌合规，直接return true
        if (!lastDeal) {
            if (!thisDeal) {
                return false;
            } else {
                return true;
            }
        } else {
            // 如果thisDeal为null，说明出牌不合规，返回false
            if (!thisDeal) {
                return false;
            } else {
                // 以下几种情况下:
                // 1、上次出牌人就是mainPlayer(说明mainPlayer上次出的牌一直没人要，所以本次可以随意出牌)
                // 2、本次出牌是王炸，那么不管上次出什么，本次都可以出牌
                // 3、本次是炸弹，上次不是，那么本次可以出牌
                // 4、本次出牌与上次出牌:
                //      a) 牌型一致
                //      b) 出牌数一致
                //      c) 本次出牌的最大牌比上次大
                // 才判定出牌合规，否则都是不合规
                if (mainPlayerId === lastDealerId) {
                    return true;
                } else if (thisDeal.cardKind === GameRule.KING_BOMB) {
                    return true;
                } else if (thisDeal.cardKind === GameRule.BOMB && (lastDeal.cardKind !== GameRule.BOMB || lastDeal.cardKind !== GameRule.KING_BOMB)) {
                    return true;
                } else if (thisDeal.cardKind === lastDeal.cardKind && thisDeal.size === lastDeal.size && thisDeal.val > lastDeal.val) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

GameRule.ONE = 1;
GameRule.PAIRS = 2;
GameRule.THREE = 3;
GameRule.THREE_WITH_ONE = 4;
GameRule.THREE_WITH_PAIRS = 5;
GameRule.PROGRESSION = 6;
GameRule.PROGRESSION_PAIRS = 7;
GameRule.PLANE = 8;
GameRule.PLANE_WITH_ONE = 9;
GameRule.PLANE_WITH_PAIRS = 10;
GameRule.FOUR_WITH_TWO = 11;
GameRule.FOUR_WITH_TWO_PAIRS = 12;
GameRule.BOMB = 13;
GameRule.KING_BOMB = 14;


export default GameRule;