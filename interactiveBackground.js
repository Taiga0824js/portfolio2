document.addEventListener('DOMContentLoaded', () => {
    // オーバーレイの作成
    const welcomeOverlay = document.createElement('div');
    welcomeOverlay.style.position = 'fixed';
    welcomeOverlay.style.top = 0;
    welcomeOverlay.style.left = 0;
    welcomeOverlay.style.width = '100%';
    welcomeOverlay.style.height = '100%';
    welcomeOverlay.style.background = 'linear-gradient(135deg, #1e3a5f, #4a90e2)'; // 青色基調のグラデーション背景
    welcomeOverlay.style.zIndex = 10000;
    welcomeOverlay.style.display = 'flex';
    welcomeOverlay.style.justifyContent = 'center';
    welcomeOverlay.style.alignItems = 'center';
    welcomeOverlay.style.transition = 'opacity 1.5s ease';
    document.body.appendChild(welcomeOverlay);

    // Three.js のシーン作成
    const scene = new THREE.Scene();

    // カメラの作成 (Z軸を小さく調整してテキストが遠くならないように)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50; // 最初は少し遠めに設定

    // レンダラーの作成
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    welcomeOverlay.appendChild(renderer.domElement);

    // 照明の追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // フォントローダーでフォントを読み込み
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry('Welcome to My Portfolio!', {
            font: font,
            size: 5,
            height: 1.5, // 厚みを調整
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.4,
            bevelSize: 0.2,
            bevelSegments: 5
        });

        // 青色を基調にしたマテリアル
        const textMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db, // 青色
            specular: 0x9ea7b8, // 青みを帯びた反射
            shininess: 100,
            reflectivity: 0.8
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // テキストの中心を計算して配置
        textGeometry.computeBoundingBox();
        const center = new THREE.Vector3();
        textGeometry.boundingBox.getCenter(center);
        textMesh.position.sub(center);

        scene.add(textMesh);

        // 回転アニメーションの代わりにZ軸方向に近づくアニメーション
        let opacity = 0;
        let zPosition = 50; // カメラの最初の位置
        textMaterial.transparent = true;

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            // テキストが徐々にカメラに近づく
            if (zPosition > 5) { // 5まで近づくと停止
                zPosition -= 0.5; // 徐々にカメラに近づく速度
                camera.position.z = zPosition;
            }

            // フェードイン
            if (opacity < 1) {
                opacity += 0.02;
                textMaterial.opacity = opacity;
            }
        }

        animate();

        // 3秒後にフェードアウト処理
        setTimeout(() => {
            welcomeOverlay.style.opacity = 0;
            const fadeOutInterval = setInterval(() => {
                if (opacity > 0) {
                    opacity -= 0.02;
                    textMaterial.opacity = opacity;
                } else {
                    clearInterval(fadeOutInterval);
                    renderer.dispose();  // レンダラーを正しく削除
                    scene.remove(textMesh);  // メッシュを削除
                    welcomeOverlay.remove(); // オーバーレイ自体を削除
                }
            }, 30);
        }, 2000); // 4秒後にフェードアウトを開始
    });

    // ウィンドウリサイズ対応
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});
