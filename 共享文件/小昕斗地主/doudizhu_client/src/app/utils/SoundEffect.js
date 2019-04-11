class SoundEffect {
    constructor() {
        
    }

    play(audioType, gender = 'male') {
        let audio = document.createElement('AUDIO');
        audio.volume = 0.7;
        audio.loop = false;
        audio.autoplay = true;

        let urls = SoundEffect.sound[audioType][gender];
        let url = './../static/audio/' + urls[Math.floor(Math.random() * urls.length)];
        audio.src = url;
    }
}

SoundEffect.sound = {
    pass: {
        male: ['guo_M.ogg', 'buyao_M.ogg', 'yaobuqi_M.ogg'],
        female: ['guo_F.ogg', 'buyao_F.ogg', 'yaobuqi_F.ogg']
    },
    deal: {
        male: ['guanshang_M.ogg'],
        female: ['guanshang_F.ogg']
    },
    chupai: {
        male: ['chupai.ogg'],
        female: ['chupai.ogg']
    },
    one: {
        male: ['1fen_M.wav'],
        female: ['1fen_F.ogg']
    },
    two: {
        male: ['2fen_M.wav'],
        female: ['2fen_F.ogg']
    },
    three: {
        male: ['3fen_M.wav'],
        female: ['3fen_F.ogg']
    },
    nocompete: {
        male: ['buyao_M.ogg'],
        female: ['buyao_F.ogg']
    }
}

export const getSoundEffect = (function getSoundEffect() {
    let se = null;
    return function () {
        if (!se) {
            se = new SoundEffect();
        }
        return se;
    }
})();