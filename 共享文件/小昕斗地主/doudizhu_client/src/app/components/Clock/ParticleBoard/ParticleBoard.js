class Particle {
    constructor(canvas, pSize = 7) {
        this.range = Math.random() * 180 / Math.PI;                                 // 随机的其实位置角度
        this.spread = canvas.height;                                                // 最远的起始距离
        this.size = Math.random() * pSize;                                          // 粒子的大小
        this.delta = 0.25;
        this.x = 0;                                                                 // 粒子的位置
        this.y = 0;
        this.px = (canvas.width / 2) + (Math.cos(this.range) * this.spread);        // 粒子初始位置
        this.py = (canvas.width / 2) + (Math.sin(this.range) * this.spread);
        this.velocityX = Math.floor(Math.random() * 10) - 5;                        // 粒子x、y方向的速度
        this.velocityY = Math.floor(Math.random() * 10) - 5;
        this.originSize = this.size;                                                // 粒子原始大小
        this.inText = false;                                                        // 粒子是否在文本中
    }
}

class ParticleBoard {
    constructor(parent,
        width = 300,
        height = 150,
        textSize = 140,
        particleNum = 600,
        particleSize = 7,
        density = 6,
        gradientStops = { 0: '#333333', 0.5: '#222222' },
        particleColor = 'rgba(255, 255, 255, 0.7)',
        id = null) {
        this.parent = parent;                                           // 粒子信息板的父级DOM容器        
        this.canvas = null;                                             // canvas
        this.width = width;                                             // canvas宽、高
        this.height = height;
        this.ctx = null;
        this.gradientStops = gradientStops;                             // 渐变色的颜色设置
        this._gradient = null;                                          // 渐变背景色，内部使用，由gradientStops生成
        this.particles = [];                                            // 粒子的数组
        this.particleColor = particleColor;                             // 粒子颜色
        this.text = null;                                               // 文本内容
        this.textSize = textSize;                                       // 文本的大小
        this.particleNum = particleNum;                                 // 粒子数量
        this.radius = Math.PI * 2;
        this.density = density;                                         // 粒子的密度，也就是采样间隔
        this.particleSize = particleSize;                               // 粒子的大小
        this.id = id;
        this._uid = null;                                               // requestAnimationFrame的标识

        this.init();
    }

    init() {
        this.initCanvas();
        this.initParticles();
    }

    initCanvas() {
        let canvas = document.createElement('canvas');
        if (this.id) {
            canvas.id = this.id;
        }
        canvas.style.position = 'absolute';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        const ctx = canvas.getContext ? canvas.getContext('2d') : (eval('throw new Error("您的浏览器不支持canvas，无法使用粒子信息板...")'));
        this.ctx = ctx;
        this.canvas = canvas;

        this.setDimension(this.width, this.height);
        this.setGradient();

        this.parent.append(this.canvas);
    }

    setDimension(width, height) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
    }

    initParticles() {
        for (let i = 0; i < this.particleNum; i++) {
            this.particles[i] = new Particle(this.canvas, this.particleSize);
        }
    }

    setGradient() {
        let { ctx, width, height, gradientStops } = this;
        // create gradient 从canvas中部开始往四周渐变
        this._gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);

        // iterate through colorstops
        for (let position in gradientStops) {
            let color = gradientStops[position];
            this._gradient.addColorStop(position, color);
        }
    }

    draw(text) {
        this.text = text;
        if (!this._uid) {
            this._uid = window.requestAnimationFrame(this.loop.bind(this));
        }
    }

    stopDraw() {
        if (this._uid) {
            window.cancelAnimationFrame(this._uid);
            this._uid = null;
        }
    }

    loop() {
        // 清除整个canvas内的东西
        const { ctx, width, height, textSize, _gradient, text } = this;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.textBaseline = "middle";
        ctx.font = textSize + "px 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'";
        ctx.fillText(text, (width - ctx.measureText(text).width) * 0.5, height * 0.5);


        // 获取canvas的像素信息
        let imgData = ctx.getImageData(0, 0, width, height);

        // 再次清除canvas
        ctx.clearRect(0, 0, width, height);

        // 绘制canvas背景
        ctx.fillStyle = _gradient;
        ctx.fillRect(0, 0, width, height);

        // 绘制文本粒子
        this.particleText(imgData);

        window.requestAnimationFrame(this.loop.bind(this));
    }

    particleText(imgData) {
        const { density, width, height, particles } = this;
        let pxls = [];

        // 从右到左，并且从上到下循环采样，每隔6行采一次样
        // （行像素点个数w + 每行像素个数*行数h）= 这个采样点处于屏幕像素序列的第几位
        // canvas的imageData，将每一个像素用rgba四个值表示，上面的位数*4 等于在imageData中，当前采样像素点的颜色值R
        // 若这个颜色值的R分量大于10，认为这个是文字区域内的像素点
        // 因为imageData是在canvas清除所有内容，画上rgb(255,255,255)的文本后获取，非文本区域的颜色值为rgba(0,0,0,0)
        // 所以下面代码中imageData.data[index] > 10可判断出是否是文本区域内的像素点，实际上10是随意写的，大于0即可
        for (let w = width; w > 0; w -= density) {
            for (let h = 0; h < height; h += density) {
                let index = (w + h * (width)) * 4;
                if (imgData.data[index] > 10) {
                    pxls.push([w, h]);
                }
            }
        }

        let count = pxls.length;
        // pxls代表了文字区域内采样出来的点的个数，在这些点的位置，绘制粒子
        // 循环最后count--，表示i=0时，第一个粒子，对应着采样的最后一个像素点，即所有像素点中最左下角的像素点
        for (let i = 0; i < pxls.length && i < particles.length; i++) {
            try {
                let p = particles[i],
                    X,
                    Y;

                X = (pxls[count - 1][0]) - p.px;
                Y = (pxls[count - 1][1]) - p.py;

                // tangent
                let T = Math.sqrt(X * X + Y * Y);

                // arctangent
                let A = Math.atan2(Y, X);

                // cosine
                let C = Math.cos(A);

                // sine
                let S = Math.sin(A);

                // set new postition
                p.x = p.px + C * T * p.delta;
                p.y = p.py + S * T * p.delta;

                // set previous positions
                p.px = p.x;
                p.py = p.y;

                p.inText = true;

                // draw the particle
                this.drawParticle(p);
            }
            catch (e) {
                console.log(e);
            }
            count--;
        }
    }

    drawParticle(p) {
        const { ctx, particleColor, radius } = this;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        // arc()方法参数分别表示：
        // 圆的中心点x坐标
        // 圆的中心点y坐标
        // 圆半径r
        // 其实角度(弧度)
        // 终止角度(弧度)
        // countclockwise顺时针还是逆时针绘制(false顺时针，true逆时针)
        ctx.arc(p.x, p.y, p.size, 0, radius, true);
        ctx.closePath();
        ctx.fill();
    };
}

export default ParticleBoard;