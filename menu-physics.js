document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');

    // Matter.jsエンジンの設定
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
            pixelRatio: window.devicePixelRatio
        }
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // ボタンの物理ボディを作成
    let body;
    menuToggle.addEventListener('dblclick', () => {
        const rect = menuToggle.getBoundingClientRect();
        body = Matter.Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                restitution: 1, // 跳ね返り係数を設定（最大値）
                friction: 0.1, // 摩擦を設定
                frictionAir: 0.02, // 空気抵抗を設定
                render: {
                    sprite: {
                        texture: createButtonImage(menuToggle),
                        xScale: 1,
                        yScale: 1
                    }
                }
            }
        );

        // 手前に表示させるためにz-indexを上げる
        body.render.zIndex = 1000;

        Matter.World.add(engine.world, body);
        menuToggle.style.visibility = 'hidden'; // 元のボタンを非表示にする
    });

    // マウスカーソルに当たったときに跳ね返る
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Matter.Events.on(mouseConstraint, 'mousemove', function(event) {
        const mousePosition = event.mouse.position;

        // ボタンにマウスカーソルが当たったときに跳ね返るように力を加える
        if (body) {
            const forceMagnitude = 0.02 * body.mass; // 力の大きさを調整
            Matter.Body.applyForce(body, body.position, {
                x: (body.position.x - mousePosition.x) * forceMagnitude,
                y: (body.position.y - mousePosition.y) * forceMagnitude
            });
        }
    });

    Matter.World.add(engine.world, mouseConstraint);

    // ボタンを画像に変換する関数
    function createButtonImage(button) {
        const rect = button.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = window.getComputedStyle(button).backgroundColor;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = window.getComputedStyle(button).color;
        ctx.font = 'bold 16px Arial'; // フォント設定を適宜変更
        ctx.fillText(button.innerText, 10, rect.height / 1.5); // テキスト描画位置
        return canvas.toDataURL();
    }

    // ウィンドウサイズ変更に対応する
    window.addEventListener('resize', () => {
        Matter.Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight }
        });
    });
});
